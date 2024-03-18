import { create } from "zustand";
// Define the type for the store state
interface InitialAppState {
    isFirstTime: boolean;
    setIsFirstTime: (value: boolean) => void;
  }
  
const useChangeInitialMode = create<InitialAppState>((set) => ({
    isFirstTime: true,
    setIsFirstTime: (value) => set({ isFirstTime: value }),
}))

export { useChangeInitialMode }