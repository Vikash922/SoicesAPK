import { create } from 'zustand';

type ViewMode = 'grid' | 'list';

type FilterState = {
  category: string[];
  priceRange: string[];
  rating: string[];
  origin: string[];
};

interface SearchStore {
  query: string;
  filters: FilterState;
  sortBy: 'popular' | 'priceLow' | 'priceHigh' | 'rating';
  viewMode: ViewMode;
  setQuery: (q: string) => void;
  toggleFilter: (key: keyof FilterState, value: string) => void;
  clearFilters: () => void;
  setSortBy: (sort: SearchStore['sortBy']) => void;
  setViewMode: (mode: ViewMode) => void;
}

const defaultFilters: FilterState = {
  category: [],
  priceRange: [],
  rating: [],
  origin: [],
};

export const useSearchStore = create<SearchStore>((set) => ({
  query: '',
  filters: defaultFilters,
  sortBy: 'popular',
  viewMode: 'grid',
  setQuery: (query) => set({ query }),
  toggleFilter: (key, value) =>
    set((state) => {
      const has = state.filters[key].includes(value);
      return {
        filters: {
          ...state.filters,
          [key]: has ? state.filters[key].filter((v) => v !== value) : [...state.filters[key], value],
        },
      };
    }),
  clearFilters: () => set({ filters: defaultFilters }),
  setSortBy: (sortBy) => set({ sortBy }),
  setViewMode: (viewMode) => set({ viewMode }),
}));
