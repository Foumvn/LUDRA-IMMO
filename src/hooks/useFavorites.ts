import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favorites: number[];
  toggleFavorite: (propertyId: number) => void;
  addFavorite: (propertyId: number) => void;
  removeFavorite: (propertyId: number) => void;
  isFavorite: (propertyId: number) => boolean;
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (propertyId: number) => {
        const { favorites } = get();
        console.log('Toggle favorite:', propertyId, 'Current favorites:', favorites);

        if (favorites.includes(propertyId)) {
          const newFavorites = favorites.filter(id => id !== propertyId);
          console.log('Removing from favorites. New favorites:', newFavorites);
          set({ favorites: newFavorites });
        } else {
          const newFavorites = [...favorites, propertyId];
          console.log('Adding to favorites. New favorites:', newFavorites);
          set({ favorites: newFavorites });
        }
      },

      addFavorite: (propertyId: number) => {
        const { favorites } = get();
        if (!favorites.includes(propertyId)) {
          set({ favorites: [...favorites, propertyId] });
        }
      },

      removeFavorite: (propertyId: number) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(id => id !== propertyId) });
      },

      isFavorite: (propertyId: number) => {
        return get().favorites.includes(propertyId);
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);