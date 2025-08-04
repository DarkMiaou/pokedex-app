import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useFavorites } from '../../hooks/useFavorites';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function PokemonDetails() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const [pokemon, setPokemon] = useState<any>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isFav, setIsFav] = useState(false);

useEffect(() => {
  if (name && typeof name === 'string') {
    setIsFav(isFavorite(name));
  }
}, [isFavorite, name]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      setPokemon(res.data);
    };
    fetchData();
  }, [name]);

  if (!pokemon) return <Text>Chargement...</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{pokemon.name}</Text>
      <Image
        source={{ uri: pokemon.sprites.front_default }}
        style={styles.image}
      />

      <Text style={styles.subtitle}>Types :</Text>
      {pokemon.types.map((t: any) => (
        <Text key={t.type.name} style={styles.type}>
          {t.type.name}
        </Text>
      ))}

      <Text style={styles.subtitle}>Stats :</Text>
      {pokemon.stats.map((s: any) => (
        <Text key={s.stat.name}>
          {s.stat.name}: {s.base_stat}
        </Text>
      ))}
      <TouchableOpacity
        onPress={() => {
            if (typeof name === 'string') {
            if (isFav) {
                removeFavorite(name);
            } else {
                addFavorite(name);
            }
            setIsFav(!isFav);
            }
        }}
        style={{
            backgroundColor: isFav ? '#999' : '#e3350d',
            padding: 12,
            borderRadius: 8,
            marginTop: 16,
        }}
        >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textTransform: 'capitalize' },
  image: { width: 150, height: 150, marginVertical: 12 },
  subtitle: { marginTop: 16, fontSize: 18, fontWeight: '600' },
  type: {
    textTransform: 'capitalize',
    backgroundColor: '#eee',
    padding: 6,
    marginVertical: 2,
    borderRadius: 6,
  },
  backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  marginBottom: 16,
  },
  backText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },

});
