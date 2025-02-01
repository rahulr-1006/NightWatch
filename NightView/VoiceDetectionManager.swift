import Foundation
import AVFoundation
import Speech

protocol VoiceDetectionManagerDelegate: AnyObject {
    func didDetectEmergencyPhrase()
}

class VoiceDetectionManager {
    
    weak var delegate: VoiceDetectionManagerDelegate?
    
    private let audioEngine = AVAudioEngine()
    private let speechRecognizer: SFSpeechRecognizer? = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    
    private let emergencyPhrase = "nightview help"
    
    /// Requests speech recognition authorization.
    func requestSpeechAuthorization(completion: @escaping (Bool) -> Void) {
        SFSpeechRecognizer.requestAuthorization { authStatus in
            DispatchQueue.main.async {
                completion(authStatus == .authorized)
            }
        }
    }
    
    /// Starts the audio engine and speech recognizer to listen continuously.
    func startListening() {
        if audioEngine.isRunning {
            stopListening()
        }
        
        // Configure the audio session.
        let audioSession = AVAudioSession.sharedInstance()
        do {
            try audioSession.setCategory(.record, mode: .measurement, options: .duckOthers)
            try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
        } catch {
            print("Audio session error: \(error)")
            return
        }
        
        // Set up the recognition request.
        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        guard let recognitionRequest = recognitionRequest else { return }
        recognitionRequest.shouldReportPartialResults = true
        
        let inputNode = audioEngine.inputNode
        let recordingFormat = inputNode.outputFormat(forBus: 0)
        
        // Install a tap to send audio data to the recognizer.
        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { (buffer, when) in
            recognitionRequest.append(buffer)
        }
        
        // Start the recognition task.
        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            guard let self = self else { return }
            
            if let result = result {
                let transcript = result.bestTranscription.formattedString.lowercased()
                print("Transcript: \(transcript)")
                if transcript.contains(self.emergencyPhrase) {
                    self.delegate?.didDetectEmergencyPhrase()
                }
            }
            
            if error != nil || (result?.isFinal ?? false) {
                self.stopListening()
                // Optionally restart listening after a delay.
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                    self.startListening()
                }
            }
        }
        
        audioEngine.prepare()
        do {
            try audioEngine.start()
        } catch {
            print("Audio engine failed to start: \(error)")
        }
    }
    
    /// Stops the audio engine and recognition task.
    func stopListening() {
        if audioEngine.isRunning {
            audioEngine.stop()
            audioEngine.inputNode.removeTap(onBus: 0)
            recognitionRequest?.endAudio()
        }
        recognitionTask?.cancel()
        recognitionTask = nil
        recognitionRequest = nil
    }
}
