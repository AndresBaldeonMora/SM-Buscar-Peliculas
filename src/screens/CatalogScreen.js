import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { searchMovies } from "../services/movies";

export default function CatalogScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMovies = async (search, pageNum) => {
    if (search.trim() === "") {
      setMovies([]);
      setHasMore(false);
      return;
    }

    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const results = await searchMovies({ search, page: pageNum });

      if (results && results.length > 0) {
        if (pageNum === 1) {
          setMovies(results);
        } else {
          setMovies((prev) => [...prev, ...results]);
        }
        setHasMore(results.length === 10);
      } else {
        if (pageNum === 1) setMovies([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchMovies(searchTerm, 1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(searchTerm, nextPage);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator size="small" color="#0a84ff" style={{ margin: 16 }} />;
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.poster !== "N/A" ? (
        <Image source={{ uri: item.poster }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.noImage]}>
          <Text>No Image</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.year}>{item.year}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar película..."
        style={styles.input}
        value={searchTerm}
        onChangeText={setSearchTerm}
        autoCorrect={false}
      />

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color="#0a84ff" />
      ) : movies.length === 0 && searchTerm !== "" ? (
        <Text style={styles.empty}>No se encontraron películas</Text>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#f0f8ff" },
  input: {
    height: 44,
    borderColor: "#0a84ff",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  poster: {
    width: 100,
    height: 150,
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  year: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  empty: {
    marginTop: 50,
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },
});
