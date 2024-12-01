import type {
    BookRatingPayload,
    BookRatingResponse,
    BookResponse,
    CategoriesResponse,
    SearchSuggestionsResponse,
    UserAuthResponse,
    UserLibraryResponse,
} from "./apiResponseTypes";
import { defaultFetch } from "./defaultFetch";

export const getAuthCallback = async (): Promise<void> => {
    const res = await defaultFetch(`auth/callback`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });

    return res.json();
};

export const login = async (): Promise<{ authUrl: string }> => {
    const res = await defaultFetch(`auth/login`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ currentUrl: window.location.href }),
    });

    return res.json();
};

export const logout = async (): Promise<{ authUrl: string }> => {
    const res = await defaultFetch(`auth/logout`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });

    return res.json();
};

export const getUser = async (): Promise<UserAuthResponse> => {
    const res = await defaultFetch(`users/`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });

    return res.json();
};

export const getSearchSuggestions = async (
    query: string,
    limit: number
): Promise<SearchSuggestionsResponse> => {
    const res = await defaultFetch(
        `books/searchSuggestions?q=${query}&limit=${limit}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
        }
    );
    return res.json();
};

export const searchBooks = async (
    query: string,
    signal?: AbortSignal,
    page: number = 1,
    limit: number = 10
): Promise<BookResponse[]> => {
    const res = await defaultFetch(
        `books/search?q=${query}&page=${page}&limit=${limit}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
            signal,
        }
    );
    return res.json();
};

export const getCategories = async (
    signal?: AbortSignal
): Promise<CategoriesResponse> => {
    const res = await defaultFetch(`staticData/genre`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        signal,
    });
    return res.json();
};

export const getBookById = async (
    id: string,
    signal?: AbortSignal
): Promise<BookResponse> => {
    const res = await defaultFetch(`books/byId/${id}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        signal,
    });
    return res.json();
};

export const getLatestReleases = async (
    signal?: AbortSignal
): Promise<BookResponse[]> => {
    const res = await defaultFetch(`books/latest`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        signal,
    });
    return res.json();
};

export const getRelatedBooks = async (
    bookId: string,
    limit: number = 10,
    signal?: AbortSignal
): Promise<BookResponse[]> => {
    const res = await defaultFetch(`books/related/${bookId}?limit=${limit}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        signal,
    });
    return res.json();
};

export const addBookRating = async (
    payload: BookRatingPayload
): Promise<{ message: string; ratingId: string }> => {
    const res = await defaultFetch(`books/ratings/add`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(payload),
    });
    return res.json();
};

export const myRatingForBook = async (
    bookId: string,
    signal?: AbortSignal
): Promise<BookRatingResponse> => {
    const res = await defaultFetch(`books/ratings/myRatingFor/${bookId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        signal,
    });
    return res.json();
};

export const getBookRatings = async (
    bookId: string,
    signal?: AbortSignal,
    page: number = 1,
    limit: number = 10,
    sortBy: string = "updatedAt"
): Promise<BookRatingResponse[]> => {
    const res = await defaultFetch(
        `books/ratings/${bookId}?page=${page}&limit=${limit}&sortBy=${sortBy}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
            signal,
        }
    );
    return res.json();
};

export const deleteBookRating = async (
    ratingId: string
): Promise<{ message: string }> => {
    const res = await defaultFetch(`books/ratings/delete/${ratingId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "DELETE",
    });
    return res.json();
};

export const getLibrary = async (
    page: number = 1,
    limit: number = 10,
    signal?: AbortSignal
): Promise<UserLibraryResponse> => {
    const res = await defaultFetch(
        `myLibrary/getBooks?page=${page}&limit=${limit}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
            method: "GET",
            signal,
        }
    );
    return res.json();
};

export const addBookToLibrary = async (
    bookId: string
): Promise<{ message: string }> => {
    const res = await defaultFetch(`myLibrary/addBook/${bookId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "PUT",
    });
    return res.json();
};

export const removeBookFromLibrary = async (
    bookId: string
): Promise<{ message: string }> => {
    const res = await defaultFetch(`myLibrary/removeBook/${bookId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "PATCH",
    });
    return res.json();
};

export const isBookInMyLibrary = async (
    bookId: string,
    signal?: AbortSignal
): Promise<{ isInLibrary: boolean }> => {
    const res = await defaultFetch(`myLibrary/isBookInLibrary/${bookId}`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
        signal,
    });
    return res.json();
};
