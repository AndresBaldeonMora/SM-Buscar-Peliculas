import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ value, onChange }) {
  return (
    <TextInput
      placeholder="Buscar película..."
      style={styles.input}
      value={value}
      onChangeText={onChange}
      autoCorrect={false}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 44,
    borderColor: '#0a84ff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
});
