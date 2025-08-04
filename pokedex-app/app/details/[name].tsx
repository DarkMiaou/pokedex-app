import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useFavorites } from '../../hooks/useFavorites';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getColorByType } from '../../utils/colorsByType';

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

  const mainType = pokemon.types[0].type.name;
  const bgColor = getColorByType(mainType);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: bgColor }]}
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backText}>Retour</Text>
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>{pokemon.name}</Text>
        <Image
          source={{ uri: pokemon.sprites.front_default }}
          style={styles.image}
        />

        <Text style={styles.subtitle}>Types :</Text>
        <View style={styles.typeContainer}>
          {pokemon.types.map((t: any) => (
            <View
              key={t.type.name}
              style={[
                styles.typeBadge,
                { backgroundColor: getColorByType(t.type.name) },
              ]}
            >
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.subtitle}>Stats :</Text>
        {pokemon.stats.map((s: any) => (
          <Text key={s.stat.name} style={styles.stat}>
            {s.stat.name}: {s.base_stat}
          </Text>
        ))}

        <TouchableOpacity
          onPress={() => {
            if (typeof name === 'string') {
              if (isFav) removeFavorite(name);
              else addFavorite(name);
              setIsFav(!isFav);
            }
          }}
          style={[
            styles.favButton,
            { backgroundColor: isFav ? '#999' : '#e3350d' },
          ]}
        >
          <Text style={styles.favText}>
            {isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: { width: 150, height: 150, marginVertical: 12 },
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
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  stat: {
    fontSize: 16,
    marginVertical: 2,
  },
  favButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  favText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
