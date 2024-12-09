import { getUser, logout } from "@/lib/apiClient";
import type { UserAuthResponse } from "@/lib/apiResponseTypes";
import { create } from "zustand";

export interface UserAuthStore {
    user: UserAuthResponse | null;
    setUser: (user: UserAuthResponse) => void;
    resetUser: () => void;
    getAuth: () => Promise<boolean>;
    logoutAndResetUser: () => void;
}

const useUserAuthStore = create<UserAuthStore>((set, get) => ({
    user: null as UserAuthResponse | null,
    setUser: (user: UserAuthResponse) => set({ user }),
    resetUser: () => set({ user: null }),
    getAuth: async (): Promise<boolean> => {
        const props = get();
        if (props.user) return true;
        try {
            const res = await getUser();
            set({ user: res });
            return true;
        } catch (error) {
            console.log(error);
        }
        return false;
    },
    logoutAndResetUser: async () => {
        const props = get();
        try {
            await logout();
            props.resetUser();
        } catch (err) {
            console.log(err);
        }
    },
}));

export default useUserAuthStore;
