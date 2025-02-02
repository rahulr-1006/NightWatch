import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';




const RootLayout = () => {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Skarleto': require('../assets/fonts/SkarletoRegular-9Mvzy.otf'),
  })

  if (!fontsLoaded) {
    return null; // Return null while fonts load (previously used AppLoading)
  }

  return (


      

      <View style={styles.container}>

      <Text style={styles.header}>NightWatch</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>End Recording</Text>
          </TouchableOpacity>
        </View>

 
      </View>

  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'space-between', // Keeps items spread out
    alignItems: 'center',
    paddingVertical: 50,
  },


  buttonContainer: {
    position: 'absolute', // Fixes the button at a specific position
    bottom: 70, // Distance from the bottom of the screen


  },
  
  button: {
    backgroundColor: '#FF0001',
    paddingVertical: 20,
    paddingHorizontal: 80,
    borderRadius: 10,
    textAlign: 'center',
    justifyContent: 'center',

    
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },



  

});

export default RootLayout;
