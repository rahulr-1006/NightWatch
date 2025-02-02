import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import React, { useState } from "react";
import Voice from "react-native-voice";

const RootLayout = () => {
  const [isNightWatchActive, setIsNightWatchActive] = useState(false);

  const activateNightWatch = async () => {
    setIsNightWatchActive(true);
    try {
      await Voice.start("en-US");
    } catch (error) {
      console.error("Error starting voice recognition:", error);
    }

    // 🚀 Placeholder for future camera features
    activateCameraFeatures();
  };

  const deactivateNightWatch = async () => {
    setIsNightWatchActive(false);
    try {
      await Voice.stop();
    } catch (error) {
      console.error("Error stopping voice recognition:", error);
    }
  };

  const activateCameraFeatures = () => {
    console.log("🚀 Camera activation logic will go here...");
    // TODO: Implement camera streaming & security features
  };

  return (
    <ImageBackground source={require("../assets/StarsBackground.png")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Header</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.nightWatchButton]} 
            onPress={isNightWatchActive ? deactivateNightWatch : activateNightWatch}
          >
            <Text style={styles.buttonText}>
              {isNightWatchActive ? "Deactivate NightWatch" : "Activate NightWatch"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>This is a Bottom Card</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
  },
  nightWatchButton: {
    backgroundColor: "#ff4c4c", // Red for NightWatch activation
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    width: "90%",
    borderRadius: 15,
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default RootLayout;
