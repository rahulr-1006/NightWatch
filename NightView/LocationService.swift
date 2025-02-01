import Foundation
import CoreLocation

protocol LocationServiceDelegate: AnyObject {
    func didUpdateLocation(_ location: CLLocation)
}

class LocationService: NSObject, CLLocationManagerDelegate {
    
    private let locationManager = CLLocationManager()
    weak var delegate: LocationServiceDelegate?
    
    /// Returns the most recent location.
    var currentLocation: CLLocation? {
        return locationManager.location
    }
    
    override init() {
        super.init()
        locationManager.delegate = self
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
    }
    
    /// Requests location authorization.
    func requestLocationAuthorization() {
        locationManager.requestWhenInUseAuthorization()
    }
    
    /// Starts location updates.
    func startUpdatingLocation() {
        locationManager.startUpdatingLocation()
    }
    
    /// Stops location updates.
    func stopUpdatingLocation() {
        locationManager.stopUpdatingLocation()
    }
    
    // MARK: - CLLocationManagerDelegate
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if let latestLocation = locations.last {
            delegate?.didUpdateLocation(latestLocation)
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Location update failed: \(error)")
    }
}
