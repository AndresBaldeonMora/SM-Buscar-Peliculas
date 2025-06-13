import React, { useContext } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { FavoritesContext } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';

export default function FavoritesScreen({ navigation }) {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tienes películas favoritas aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          onPress={() =>
            navigation.navigate('MovieDetail', { id: item.id })
          }
        />
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
