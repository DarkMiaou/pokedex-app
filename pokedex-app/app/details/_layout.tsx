import { Stack } from 'expo-router';

export default function DetailsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: 'Détails du Pokémon',
      }}
    />
  );
}
