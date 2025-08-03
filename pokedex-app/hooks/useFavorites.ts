import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem('favorites');
    if (data) {
      setFavorites(JSON.parse(data));
    }
  };

  const addFavorite = async (name: string) => {
    if (!favorites.includes(name)) {
      const newFavorites = [...favorites, name];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFavorite = async (name: string) => {
    const newFavorites = favorites.filter((fav) => fav !== name);
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (name: string) => favorites.includes(name);

  return { favorites, addFavorite, removeFavorite, isFavorite };
}
