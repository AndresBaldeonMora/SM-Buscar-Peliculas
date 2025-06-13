import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { getMovieById } from "../services/movies";
import { FavoritesContext } from "../context/FavoritesContext";

export default function MovieDetailScreen({ route }) {
  const { id } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext);

  useEffect(() => {
    async function loadMovie() {
      const data = await getMovieById(id);
      setMovie(data);
      setLoading(false);
    }
    loadMovie();
  }, [id]);

  if (loading || !movie) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0a84ff" />
      </View>
    );
  }

  const isFavorite = favorites.some((fav) => fav.id === movie.imdbID);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite({
        id: movie.imdbID,
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450" }}
        style={styles.poster}
      />
      <Text style={styles.title}>{movie.Title}</Text>
      <Text style={styles.detail}>Año: {movie.Year}</Text>
      <Text style={styles.detail}>Género: {movie.Genre}</Text>
      <Text style={styles.detail}>Director: {movie.Director}</Text>
      <Text style={styles.detail}>Actores: {movie.Actors}</Text>
      <Text style={styles.detail}>Duración: {movie.Runtime}</Text>
      <Text style={styles.plot}>{movie.Plot}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title={isFavorite ? "Eliminar de Favoritos" : "Agregar a Favoritos"}
          onPress={handleFavoriteToggle}
          color={isFavorite ? "#e63946" : "#0a84ff"}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  poster: {
    width: 300,
    height: 450,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  plot: {
    fontSize: 16,
    marginTop: 15,
    lineHeight: 22,
    textAlign: "justify",
    color: "#444",
  },
  buttonContainer: {
    marginTop: 20,
    width: "80%",
  },
});
