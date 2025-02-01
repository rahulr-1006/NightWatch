import UIKit
import Foundation
import CoreLocation

class EmergencyService {
    
    static let shared = EmergencyService() // Singleton for centralized access.
    
    // Replace with your actual backend URL.
    private let backendURLString = "https://your-backend-server.com/emergency"
    
    /// Sends an emergency SMS via your backend (which uses Twilio) with the attached location.
    func sendEmergencySMSTwilio(with location: CLLocation?, completion: @escaping (Bool) -> Void) {
        guard let url = URL(string: backendURLString) else {
            print("Invalid backend URL")
            completion(false)
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        var locationString = "Location unavailable."
        if let location = location {
            locationString = "https://maps.apple.com/?ll=\(location.coordinate.latitude),\(location.coordinate.longitude)"
        }
        
        let message = "Emergency! I need help. My current location: \(locationString)"
        
        let jsonPayload: [String: Any] = [
            "message": message,
            "recipient": "911" // Adjust recipient if needed.
        ]
        
        do {
            let jsonData = try JSONSerialization.data(withJSONObject: jsonPayload, options: [])
            request.httpBody = jsonData
        } catch {
            print("Error serializing JSON: \(error)")
            completion(false)
            return
        }
        
        // Send the POST request.
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error sending emergency SMS: \(error)")
                completion(false)
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                completion(true)
            } else {
                print("Unexpected response: \(String(describing: response))")
                completion(false)
            }
        }
        task.resume()
    }
    
    /// Opens the Phone app with 911 dialed.
    func callEmergencyNumber() {
        guard let url = URL(string: "tel://911") else { return }
        if UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
        } else {
            print("Cannot initiate phone call.")
        }
    }
}
