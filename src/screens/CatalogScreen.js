import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { searchMovies } from "../services/movies";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CatalogScreen() {
  const navigation = useNavigation();

  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteGenres, setFavoriteGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      const storedGenres = await AsyncStorage.getItem("favoriteGenres");
      if (storedGenres) {
        const parsedGenres = JSON.parse(storedGenres);
        setFavoriteGenres(parsedGenres);
        fetchSuggestions(parsedGenres);
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") return;

    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchMovies(searchTerm, 1);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

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

  const fetchSuggestions = async (genres) => {
    if (!genres || genres.length === 0) return;

    setLoading(true);
    try {
      const queries = genres.map((g) =>
        g.toLowerCase().split(" ")[0]
      );

      const allResults = [];

      for (const term of queries) {
        const res = await searchMovies({ search: term, page: 1 });
        if (res && res.length > 0) {
          allResults.push(...res.slice(0, 3));
        }
      }

      setMovies(allResults);
    } catch (error) {
      console.error("Error al buscar sugerencias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && searchTerm.trim() !== "") {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(searchTerm, nextPage);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <ActivityIndicator size="small" color="#0a84ff" style={{ margin: 16 }} />
    );
  };

  const renderItem = ({ item }) => (
    <MovieCard
      movie={item}
      onPress={() => navigation.navigate("MovieDetail", { id: item.id })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {loading && page === 1 ? (
          <ActivityIndicator size="large" color="#0a84ff" />
        ) : movies.length === 0 ? (
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f8ff",
  },
  container: {
    flex: 1,
    padding: 12,
  },
  empty: {
    marginTop: 50,
    textAlign: "center",
    color: "#999",
    fontSize: 16,
  },
});
