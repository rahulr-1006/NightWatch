import UIKit
import CoreLocation

class EmergencyVoiceDetectionViewController: UIViewController {
    
    private let voiceDetectionManager = VoiceDetectionManager()
    private let locationService = LocationService()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .white
        
        // Set up delegates.
        voiceDetectionManager.delegate = self
        locationService.delegate = self
        
        // Request necessary permissions.
        voiceDetectionManager.requestSpeechAuthorization { authorized in
            if authorized {
                self.voiceDetectionManager.startListening()
            } else {
                print("Speech recognition not authorized")
            }
        }
        locationService.requestLocationAuthorization()
        locationService.startUpdatingLocation()
    }
    
    /// Triggers emergency actions: sends an SMS via Twilio and then dials 911.
    private func triggerEmergencyActions() {
        EmergencyService.shared.sendEmergencySMSTwilio(with: locationService.currentLocation) { success in
            if success {
                print("Emergency SMS sent via Twilio")
            } else {
                print("Failed to send Emergency SMS via Twilio")
            }
            DispatchQueue.main.async {
                EmergencyService.shared.callEmergencyNumber()
            }
        }
    }
}

// MARK: - VoiceDetectionManagerDelegate

extension EmergencyVoiceDetectionViewController: VoiceDetectionManagerDelegate {
    func didDetectEmergencyPhrase() {
        print("Emergency phrase detected!")
        triggerEmergencyActions()
    }
}

// MARK: - LocationServiceDelegate

extension EmergencyVoiceDetectionViewController: LocationServiceDelegate {
    func didUpdateLocation(_ location: CLLocation) {
        // Optionally handle location updates here.
        print("Updated location: \(location)")
    }
}
