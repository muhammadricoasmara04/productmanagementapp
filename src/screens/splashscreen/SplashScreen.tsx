import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const init = async () => {
      const token = await AsyncStorage.getItem('token');

      setTimeout(() => {
        if (token) {
          navigation.replace('Dashboard');
        } else {
          navigation.replace('Login');
        }
      }, 1500); 
    };

    init();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/splashscreen.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#466BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
});
