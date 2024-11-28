import type { BookResponse } from "@/lib/apiResponseTypes";
import { create } from "zustand";

export interface LatestBooksStore {
    latestBooks: BookResponse[] | [];
    setLatestBooks: (categories: BookResponse[]) => void;
    resetLatestBooks: () => void;
}

const useLatestBooksStore = create<LatestBooksStore>((set) => ({
    latestBooks: [] as BookResponse[],
    setLatestBooks: (latestBooks: BookResponse[]) => set({ latestBooks }),
    resetLatestBooks: () => set({ latestBooks: [] }),
}));

export default useLatestBooksStore;
