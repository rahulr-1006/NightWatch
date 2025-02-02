import { View, Text, StyleSheet, Button, Alert, Linking } from "react-native";
import React, { useState, useEffect } from "react";
import Voice from "react-native-voice";
import axios from "axios";

const BACKEND_IP = "YOUR_BACKEND_IP"; // Replace with actual IP

const HomeScreen = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechPartialResults = (e) => {
    if (e.value && e.value.length > 0) {
      const partialTranscript = e.value[0];
      setTranscript(partialTranscript);
      sendTranscriptToBackend(partialTranscript);
    }
  };

  const onSpeechResults = (e) => {
    if (e.value && e.value.length > 0) {
      setTranscript(e.value[0]);
    }
  };

  const onSpeechError = (e) => {
    console.error("Speech recognition error:", e.error);
  };

  const startListening = async () => {
    try {
      await Voice.start("en-US");
      setIsListening(true);
    } catch (error) {
      console.error("Error starting voice recognition:", error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error("Error stopping voice recognition:", error);
    }
  };

  const sendTranscriptToBackend = async (text) => {
    try {
      const response = await axios.post(`${BACKEND_IP}/detect`, { transcript: text });
      if (response.data.keyword_detected) {
        Alert.alert("Emergency Detected", "Initiating emergency actions.");
        triggerEmergencyActions();
      }
    } catch (error) {
      console.error("Error sending transcript:", error);
    }
  };

  const triggerEmergencyActions = async () => {
    try {
      const response = await axios.post(`${BACKEND_IP}/emergency`, { action: "siren_sms" });
      console.log("Emergency action response:", response.data);
      Linking.openURL("tel:911");
    } catch (error) {
      console.error("Error triggering emergency actions:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Page!</Text>
      <Button title={isListening ? "Stop Listening" : "Start Listening"} onPress={isListening ? stopListening : startListening} />
      <Text style={styles.transcript}>Transcript: {transcript}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  transcript: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});

export default HomeScreen;
