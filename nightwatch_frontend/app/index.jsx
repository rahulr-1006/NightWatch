import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Slot, useRouter } from 'expo-router';

const RootLayout = () => {
  const router = useRouter();

  return (
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
      <Text style={styles.footer}>Footer</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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
  footer: {
    fontSize: 16,
    color: 'gray',
  },
});

export default RootLayout;
