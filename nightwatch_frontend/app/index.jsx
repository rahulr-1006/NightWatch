import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const RootLayout = () => {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../assets/StarsBackground.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Header</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/home')} // Navigate to "home" page
          >
            <Text style={styles.buttonText}>Press to Start</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Card at the Bottom */}
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
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between', // Keeps items spread out
    alignItems: 'center',
    paddingVertical: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  /* ✅ Bottom Card Styling */
  card: {
    position: 'absolute', // Fixes it at the bottom
    bottom: 20, // Distance from the bottom
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white
    padding: 20,
    width: '90%', // Takes up most of the width
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Adds a shadow for Android
    alignItems: 'center',
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default RootLayout;
