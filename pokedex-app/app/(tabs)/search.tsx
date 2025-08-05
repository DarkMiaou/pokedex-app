import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPokemon = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`,
      );
      if (!response.ok) throw new Error('Pokémon non trouvé');
      const data = await response.json();
      setResults([data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const id = item.id; // `id` vient directement du JSON de l'API
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/details/${item.name}`)}
        style={styles.card}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher un Pokémon</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom du Pokémon"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={searchPokemon}
      />
      {loading && <Text>Chargement...</Text>}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.name}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  image: { width: 100, height: 100 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  name: { fontSize: 18, textTransform: 'capitalize', marginTop: 8 },
  deleteButton: {
    marginTop: 8,
    backgroundColor: '#ff4d4d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: { color: 'red', marginTop: 10 },
});
