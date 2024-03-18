import { create } from "zustand";
// Define the type for the store state
interface InitialAppState {
    firstTimeUseApp: boolean;
    setFirstTimeUseApp: (value: boolean) => void;
    isLogined: boolean;
    setIsLogined: (value: boolean) => void;
  }
  
const useFirstTimeUseApp = create<InitialAppState>((set) => ({
    firstTimeUseApp: true,
    setFirstTimeUseApp: (value) => set({ firstTimeUseApp: value }),
    isLogined: false,
    setIsLogined: (value) => set({isLogined: value})

}))

export { useFirstTimeUseApp }