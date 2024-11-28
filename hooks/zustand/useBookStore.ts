import type { BookResponse } from "@/lib/apiResponseTypes";
import { create } from "zustand";

export interface BookStore {
    book: BookResponse | null;
    setBook: (book: BookResponse) => void;
    resetBook: () => void;
}

const useBookStore = create<BookStore>((set) => ({
    book: null,
    setBook: (book: BookResponse) => set({ book }),
    resetBook: () => set({ book: null }),
}));

export default useBookStore;
