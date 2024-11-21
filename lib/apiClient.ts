import { defaultFetch } from "./defaultFetch";

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

export const getCategories = async (): Promise<CategoriesResponse> => {
    const res = await defaultFetch(`staticData/genre`, {
        headers: {
            "Content-Type": "application/json",
        },
        method: "GET",
    });
    return res.json();
};
