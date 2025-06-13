import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from 'react-native-safe-area-context';

const genres = [
  "Acción",
  "Comedia",
  "Drama",
  "Terror",
  "Romance",
  "Ciencia ficción",
];

export default function PreferencesScreen({ navigation }) {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContinue = async () => {
    try {
      await AsyncStorage.setItem(
        "favoriteGenres",
        JSON.stringify(selectedGenres)
      );
      navigation.replace("Main"); // navega al TabNavigator
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar tus preferencias.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>¿Cuáles son tus géneros favoritos?</Text>

      <View style={styles.genresContainer}>
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <TouchableOpacity
              key={genre}
              style={[styles.genreButton, isSelected && styles.genreSelected]}
              onPress={() => toggleGenre(genre)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.genreText,
                  isSelected && styles.genreTextSelected,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Continuar"
          onPress={handleContinue}
          disabled={selectedGenres.length === 0}
          color={selectedGenres.length === 0 ? "#ccc" : "#0a84ff"}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    rowGap: 12,
    columnGap: 12,
  },
  genreButton: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    margin: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  genreSelected: {
    backgroundColor: "#0a84ff",
    borderColor: "#0a84ff",
    shadowOpacity: 0.3,
    elevation: 5,
  },
  genreText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "500",
  },
  genreTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },
  buttonContainer: {
    marginTop: 30,
    width: "60%",
  },
});
