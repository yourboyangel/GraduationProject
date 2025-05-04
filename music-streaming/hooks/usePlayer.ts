import { create } from 'zustand';

interface PlayerStore {
  ids: string[];
  activeId?: string;
  isShuffled: boolean;
  setId: (id: string) => void;
  setIds: (ids: string[]) => void;
  setIsShuffled: (shuffled: boolean) => void;
  reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  ids: [],
  activeId: undefined,
  isShuffled: false,
  setId: (id: string) => set({ activeId: id }),
  setIds: (ids: string[]) => set({ ids: ids }),
  setIsShuffled: (shuffled: boolean) => set({ isShuffled: shuffled }),
  reset: () => set({ ids: [], activeId: undefined, isShuffled: false })
}));

export default usePlayer;