import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useFavorites } from '../hooks/useFavorites';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const results = await Promise.all(
        favorites.map((name) =>
          axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`).then((res) => res.data)
        )
      );
      setData(results);
      setLoading(false);
    };

    if (favorites.length > 0) {
      fetchDetails();
    } else {
      setData([]);
      setLoading(false);
    }
  }, [favorites]);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/details/${item.name}`)}
        style={styles.card}
      >
        <Image source={{ uri: item.sprites.front_default }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ Mes Pokémon favoris</Text>
      {loading ? (
        <Text>Chargement...</Text>
      ) : data.length === 0 ? (
        <Text>Aucun favori pour l’instant.</Text>
      ) : (
        <FlatList
          data={data}
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
  name: { fontSize: 18, textTransform: 'capitalize', marginTop: 8 },
});
