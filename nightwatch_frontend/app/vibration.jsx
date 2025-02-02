  import { CameraView, useCameraPermissions } from "expo-camera";
  import { useState, useRef, useEffect } from "react";
  import { Button, StyleSheet, Text, TouchableOpacity, View, Vibration } from "react-native";

  export default function App() {
    const [facing, setFacing] = useState("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [result, setResult] = useState("Waiting...");
    const cameraRef = useRef(null);

    // ✅ Ensure all hooks run unconditionally
    useEffect(() => {
      if (!permission?.granted) return; // Don't run effect until permission is granted

      const interval = setInterval(() => {
        captureAndSendImage();
      }, 1000);

      return () => clearInterval(interval);
    }, [permission?.granted]); // Only run when permission is granted


    useEffect(() => {
      if (result === "Yes") {
        Vibration.vibrate(200); // Vibrates for 500ms
      }
    }, [result]);

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
          const response = await fetch("url", {
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
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>


        </View>
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
      flex: 1,
      flexDirection: "row",
      backgroundColor: "transparent",
      margin: 64,
    },
    button: {
      flex: 1,
      alignSelf: "flex-end",
      alignItems: "center",
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
  });
