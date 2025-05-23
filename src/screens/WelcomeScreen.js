import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Preferences');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a MovieFinder</Text>
      <Text style={styles.subtitle}>Tu app para descubrir películas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#60c8d7', // cyan suave
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: '#004d59', // azul oscuro para contraste
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#00343a', // azul más oscuro para el subtítulo
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
