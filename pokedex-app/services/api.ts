import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

export const getPokemons = async (offset = 0, limit = 20) => {
  const res = await axios.get(`${API_URL}?offset=${offset}&limit=${limit}`);
  return res.data;
};

export const searchPokemon = async (name: string) => {
  const res = await axios.get(`${API_URL}/${name}`);
  return res.data;
};
