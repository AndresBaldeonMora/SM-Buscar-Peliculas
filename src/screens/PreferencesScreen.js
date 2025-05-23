import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuáles son tus géneros favoritos?</Text>

      <View style={styles.genresContainer}>
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <TouchableOpacity
              key={genre}
              style={[styles.genreButton, isSelected && styles.genreSelected]}
              onPress={() => toggleGenre(genre)}
              activeOpacity={0.7}
            >
              <Text style={[styles.genreText, isSelected && styles.genreTextSelected]}>
                {genre}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Continuar"
          onPress={() =>
            navigation.replace("Catalog", { genres: selectedGenres })
          }
          disabled={selectedGenres.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
    gap: 12, // Para espaciado, funciona en RN 0.71+ o puedes usar margin
  },
  genreButton: {
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 6,
    backgroundColor: "#fff",
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
