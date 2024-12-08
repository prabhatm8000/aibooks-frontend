export type SearchSuggestionsResponse = {
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

export type CategoriesResponse = {
    id: string;
    dataType: string;
    data: string[];
};

export type BookResponse = {
    id: string;
    title: string;
    summary: string;
    totalChapters: number;
    genre: string[];
    pdfUrl: string;
    pdfPublicId: string;
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
    createdAt: Date;
    rating: number;
    totalRatings: number;
};

export type BooksPageResponse = {
    pageInfo: {
        pageSize: number;
        page: number;
        sortBy: string;
        sortOrder: number;
    };
    data: BookResponse[];
};

export type UserAuthResponse = {
    id: string;
    email: string;
    email_verified: boolean;
    first_name: string;
    last_name: string;
    password: string;
    updatedAt: Date;
};

export type BookRatingPayload = {
    bookId: string;
    rating: number;
    review: string;
};

export type BookRatingResponse = {
    id: string;
    userId: string;
    bookId: string;
    rating: number;
    review: string;
    createdAt: Date;
    updatedAt: Date;
    user: UserAuthResponse;
};

export type UserLibraryResponse = {
    id: string;
    books: BookResponse[];
    totalBooks: number;
};
