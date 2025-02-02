  import { CameraView, useCameraPermissions } from "expo-camera";
  import { useState, useRef, useEffect } from "react";
  import { Button, StyleSheet, Text, TouchableOpacity, View, Vibration } from "react-native";
  import { useRouter } from 'expo-router';

  export default function App() {
    const [facing, setFacing] = useState("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [result, setResult] = useState("");
    const cameraRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
  if (!permission?.granted) return;

  const interval = setInterval(() => {
    captureAndSendImage();
  }, 1000);

  return () => clearInterval(interval);
}, [permission?.granted]); // ✅ Runs when permission is granted

  // ✅ Separate effect that responds to `result` updates
  useEffect(() => {
    let interval2 = null;

    if (result === "Yes") {
      interval2 = setInterval(() => {
        Vibration.vibrate([200, 100, 200]); // Pulse vibration
      }, 1000);
    } else {
      Vibration.cancel();
    }

    return () => {
      if (interval2) clearInterval(interval2); // ✅ Cleanup interval when result changes
      Vibration.cancel();
    };
  }, [result]); // ✅ Runs whenever `result` updates


    async function captureAndSendImage() {
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({ base64: true });

          const formData = new FormData();
          formData.append("file", {
            uri: photo.uri,
            name: "image.jpg",
            type: "image/jpeg",
          });

          // http://3.15.170.197:8000/detect/
          const response = await fetch("http://3.15.170.197:8000/detect/", {
            method: "POST",
            body: formData,
            headers: { "Content-Type": "multipart/form-data" },
          });

          const json = await response.json();
          setResult(json.result);
        } catch (error) {
          console.error("Error:", error);
        }
      }
    }

    function toggleCameraFacing() {
      setFacing((current) => (current === "back" ? "front" : "back"));
    }

    if (!permission) {
      return <View />;
    }

    if (!permission.granted) {
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: "center" }}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="Grant Permission" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity> */}

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>End Recording</Text>
          </TouchableOpacity>

          
          </View>
        </CameraView>

      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      justifyContent: 'flex-end', 
      alignItems: 'center',
      paddingBottom: 100,  

      flex: 1,

    },
    button: {
      backgroundColor: '#F60202',
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
    },
    resultContainer: {
      position: "absolute",
      bottom: 50,
      width: "100%",
      alignItems: "center",
    },
    resultText: {
      fontSize: 30,
      fontWeight: "bold",
      color: "white",
    },
    buttonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    }


  });
