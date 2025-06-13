import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { searchMovies } from "../services/movies";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

export default function CatalogScreen() {
  const navigation = useNavigation();

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
        setHasMore(results.length === 10); // OMDb devuelve 10 por página
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
    <MovieCard
      movie={item}
      onPress={() => navigation.navigate("MovieDetail", { id: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />

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
  empty: {
    marginTop: 50,
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },
});
