import type { CategoriesResponse } from "@/lib/apiResponseTypes";
import { create } from "zustand";

export interface CategoriesStore {
    categories: CategoriesResponse | null;
    setCategories: (categories: CategoriesResponse) => void;
    resetCategories: () => void;
}

const useCategoriesStore = create<CategoriesStore>((set) => ({
    categories: null as CategoriesResponse | null,
    setCategories: (categories: CategoriesResponse) => set({ categories }),
    resetCategories: () => set({ categories: null }),
}));

export default useCategoriesStore;
