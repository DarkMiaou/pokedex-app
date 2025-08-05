import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { usePokemons } from '../../hooks/usePokemons';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function Home() {
  const { pokemons, loadMore, loading } = usePokemons();
  const router = useRouter();

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const id = item.url.split('/')[6];
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20, scale: 0.95 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{
          delay: index * 40,
          type: 'timing',
          duration: 300,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push(`/details/${item.name}`)}
          style={styles.card}
        >
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
        </TouchableOpacity>
      </MotiView>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemons}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
      <TouchableOpacity
        onPress={loadMore}
        style={styles.button}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Chargement...' : 'Charger plus'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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
  button: {
    backgroundColor: '#e3350d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
