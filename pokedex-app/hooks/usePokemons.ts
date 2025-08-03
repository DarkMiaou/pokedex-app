import { useState, useEffect } from 'react';
import { getPokemons } from '../services/api';

export function usePokemons() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const data = await getPokemons(offset);
    setPokemons((prev) => [...prev, ...data.results]);
    setOffset((prev) => prev + 20);
    setLoading(false);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return { pokemons, loadMore, loading };
}
