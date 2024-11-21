type SearchSuggestionsResponse = {
    id: string;
    title: string;
    genre: string[];
    coverImage: {
        publicId: string;
        url: string;
        width: {
            small: number;
            medium: number;
            large: number;
        };
        height: {
            small: number;
            medium: number;
            large: number;
        };
    };
}[];

type CategoriesResponse = {
    id: string;
    dataType: string;
    data: string[];
};
