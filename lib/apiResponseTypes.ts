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
    aud: string;
    email: string;
    email_verified: boolean;
    exp: number;
    family_name: string;
    given_name: string;
    iat: number;
    iss: string;
    name: string;
    nickname: string;
    picture: string;
    sid: string;
    sub: string;
    updated_at: string;
};

export type UserShortResponse = {
    id: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    nickname: string;
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
    user: UserShortResponse;
};
