import type { UserAuthResponse } from "@/lib/apiResponseTypes";
import { create } from "zustand";

export interface UserAuthStore {
    user: UserAuthResponse | null;
    setUser: (user: UserAuthResponse) => void;
    resetUser: () => void;
}

const useUserAuthStore = create<UserAuthStore>((set) => ({
    user: null as UserAuthResponse | null,
    setUser: (user: UserAuthResponse) => set({ user }),
    resetUser: () => set({ user: null }),
}));

export default useUserAuthStore;
