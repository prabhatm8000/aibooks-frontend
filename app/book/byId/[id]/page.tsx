"use client";

import BookCard from "@/app/components/BookCard";
import ErrorPage from "@/app/components/ErrorPage";
import HeadingWithUnderline from "@/app/components/HeadingWithUnderline";
import LoaderPage from "@/app/components/Loader/LoaderPage";
import LoadingSpinner from "@/app/components/Loader/LoadingSpinner";
import ThreeDotLoading from "@/app/components/Loader/ThreeDotLoading";
import PageLayout from "@/app/components/PageLayout";
import StarRating from "@/app/components/StarRating";
import StarRatingInput from "@/app/components/StarRatingInput";
import { Button } from "@/app/components/ui/button";
import { ButtonLink } from "@/app/components/ui/buttonlink";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/app/components/ui/form";
import { Textarea } from "@/app/components/ui/textarea";
import {
    TypographyH1,
    TypographyH3,
    TypographyH5,
    TypographyP,
    TypographySmall,
} from "@/app/components/ui/typography";
import UserAvtar from "@/app/components/UserAvtar";
import { toast } from "@/hooks/use-toast";
import {
    addBookRating,
    addBookToLibrary,
    deleteBookRating,
    getBookById,
    getBookRatings,
    getRelatedBooks,
    isBookInMyLibrary,
    myRatingForBook,
    removeBookFromLibrary,
} from "@/lib/apiClient";
import type { BookRatingResponse, BookResponse } from "@/lib/apiResponseTypes";
import { CancelAbortMsg } from "@/lib/defaults";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BookDetailsSection = ({ book }: { book: BookResponse }) => {
    const [isInLibrary, setIsInLibrary] = useState(false);
    const [loadingIsInLibrary, setLoadingIsInLibrary] = useState(true);

    const getIsInLibrary = async () => {
        setLoadingIsInLibrary(true);
        isBookInMyLibrary(book.id)
            .then((res) => setIsInLibrary(res.isInLibrary))
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => setLoadingIsInLibrary(false));
    };

    const handleAddToLibrary = async () => {
        setLoadingIsInLibrary(true);
        addBookToLibrary(book.id)
            .then((res) => {
                toast({
                    title: "Success",
                    description: res.message,
                });
                setIsInLibrary(true);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => setLoadingIsInLibrary(false));
    };

    const handleRemoveFromLibrary = async () => {
        setLoadingIsInLibrary(true);
        removeBookFromLibrary(book.id)
            .then((res) => {
                toast({
                    title: "Success",
                    description: res.message,
                });
                setIsInLibrary(false);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => setLoadingIsInLibrary(false));
    };

    useEffect(() => {
        if (book) {
            getIsInLibrary();
        }
    }, [book]);

    return (
        <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4 min-h-[calc(50vh)] h-full relative">
            <Image
                src={book.coverImage.url}
                alt={book.title}
                width={book.coverImage.width.large}
                height={book.coverImage.height.large}
                className="object-cover fixed -z-30 top-0 right-1/2 w-full h-1/2 blur-[100px] opacity-20"
            />
            <Image
                src={book.coverImage.url}
                alt={book.title}
                width={book.coverImage.width.large}
                height={book.coverImage.height.large}
                className="object-cover rounded-md aspect-[13/19]"
            />
            <div>
                <div className="space-y-2">
                    <TypographyH1>{book.title}</TypographyH1>
                    <TypographyH3 isMuted>{book.genre.join(", ")}</TypographyH3>
                    <TypographyP isMuted>
                        {book.totalChapters} Chapters
                    </TypographyP>
                    <TypographyP isMuted>
                        Released on:{" "}
                        {new Date(book.createdAt).toLocaleDateString()}
                    </TypographyP>
                    <StarRating rating={book.rating} outOf={5} />
                    <div className="flex flex-col sm:flex-row gap-2">
                        <ButtonLink
                            href={book.pdfUrl}
                            target="_blank"
                            variant={"default"}
                            className="text-lg font-bold"
                        >
                            Read Now
                        </ButtonLink>
                        <Button
                            variant={isInLibrary ? "destructive" : "default"}
                            className="text-lg font-bold"
                            disabled={loadingIsInLibrary}
                            onClick={
                                isInLibrary
                                    ? handleRemoveFromLibrary
                                    : handleAddToLibrary
                            }
                        >
                            {loadingIsInLibrary ? (
                                <LoadingSpinner
                                    className={
                                        isInLibrary ? "" : "text-background"
                                    }
                                />
                            ) : isInLibrary ? (
                                "Remove from Library"
                            ) : (
                                "Add to Library"
                            )}
                        </Button>
                    </div>
                    <TypographyP isMuted>{book.summary}</TypographyP>
                </div>
            </div>
        </div>
    );
};

const RelatedBooksSection = () => {
    const params = useParams();
    const id = params?.id as string;

    const [loadingLatestBooks, setLoadingLatestBooks] = useState(true);
    const [relatedBooks, setRelatedBooks] = useState<BookResponse[]>([]);

    useEffect(() => {
        if (relatedBooks.length > 0) {
            setLoadingLatestBooks(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        setLoadingLatestBooks(true);
        getRelatedBooks(id, 3, signal)
            .then((res) => {
                setRelatedBooks(res);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => setLoadingLatestBooks(false));

        return () => controller.abort(CancelAbortMsg);
    }, []);
    return (
        <div className="space-y-4">
            <HeadingWithUnderline text="Related Books" />
            {loadingLatestBooks && <LoaderPage />}
            {relatedBooks?.length === 0 && !loadingLatestBooks && (
                <ErrorPage code={500} message="Something went wrong." />
            )}
            <div
                style={{
                    scrollBehavior: "smooth",
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    overflowX: "scroll",
                }}
            >
                {relatedBooks?.length > 0 && (
                    <div className="flex items-center w-full gap-4">
                        {relatedBooks.map((book) => (
                            <div
                                key={book.id}
                                className="min-w-[250px] max-w-[250px]"
                            >
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const FormSchema = z.object({
    review: z.string().trim(),
    rating: z.number().min(0).max(5),
});
function ReviewInputForm() {
    const params = useParams();
    const bookId = params?.id as string;

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [prevRating, setPrevRating] = useState<BookRatingResponse | null>(
        null
    );

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            review: "",
            rating: 0,
        },
    });

    const onSubmit = (v: z.infer<typeof FormSchema>) => {
        if (!bookId) {
            setSubmitLoading(false);
            return;
        }

        if (v.rating === 0 && v.review === "") {
            form.setError("review", {
                type: "manual",
                message: "Review cannot be empty.",
            });

            form.setError("rating", {
                type: "manual",
                message: "Rating cannot be empty.",
            });
            return;
        }

        setSubmitLoading(true);
        addBookRating({
            bookId: bookId,
            rating: v.rating,
            review: v.review,
        })
            .then((res) => {
                toast({
                    title: "Success",
                    description: res.message,
                    variant: "default",
                });
            })
            .catch((err) => toast({ description: err.message }))
            .finally(() => setSubmitLoading(false));
    };

    const handleDeleteRating = () => {
        if (!bookId || !prevRating) return;

        setIsDeleting(true);
        deleteBookRating(prevRating.id)
            .then((res) => {
                toast({
                    title: "Success",
                    description: res.message,
                    variant: "default",
                });
                setPrevRating(null);
                form.setValue("rating", 0);
                form.setValue("review", "");
            })
            .catch((err) => toast({ description: err.message }))
            .finally(() => setIsDeleting(false));
    };

    useEffect(() => {
        if (!bookId) return;

        const controller = new AbortController();
        const signal = controller.signal;

        myRatingForBook(bookId, signal)
            .then((res) => {
                setPrevRating(res);
                form.setValue("rating", res.rating);
                form.setValue("review", res.review);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => setSubmitLoading(false));

        return () => controller.abort(CancelAbortMsg);
    }, []);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full xl:w-2/3 space-y-2"
            >
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="flex justify-between items-center gap-2">
                                    <StarRatingInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        outOf={5}
                                    />
                                    {(prevRating?.rating ||
                                        prevRating?.review) && (
                                        <Button
                                            type="button"
                                            title="Delete Rating"
                                            disabled={isDeleting}
                                            variant={"destructive"}
                                            onClick={handleDeleteRating}
                                            className="flex gap-2 items-center"
                                        >
                                            <TrashIcon />
                                        </Button>
                                    )}
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="review"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Textarea
                                    className="min-h-52"
                                    placeholder="Write a review..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormDescription>
                    {prevRating?.rating || prevRating?.review
                        ? "You can update your previous review."
                        : "Share your thoughts about the book."}
                </FormDescription>
                <Button type="submit" disabled={submitLoading}>
                    Submit
                </Button>
            </form>
        </Form>
    );
}

const ReviewCard = ({ review }: { review: BookRatingResponse }) => {
    const [showMore, setShowMore] = useState(false);
    return (
        <div
            key={review.id}
            className="flex flex-col gap-2 border-b pb-2 w-full"
        >
            <div className="flex items-start justify-start gap-2 w-full">
                <UserAvtar size={40} user={review.user} />
                <div className="flex flex-col items-start justify-start gap-2 w-fit">
                    <div className="flex flex-col items-start">
                        <TypographyH5>{`${review.user.first_name} ${review.user.last_name}`}</TypographyH5>
                        <TypographySmall isMuted>
                            {review.user.email}
                        </TypographySmall>
                    </div>
                    <div className="space-y-1">
                        <StarRating rating={review.rating} outOf={5} />
                        <TypographyP isMuted className="whitespace-pre-wrap">
                            {review.review.length < 150 ? (
                                review.review
                            ) : (
                                <>
                                    {showMore
                                        ? review.review
                                        : review.review.slice(0, 150) + "..."}
                                    <span
                                        className="text-blue-500 cursor-pointer"
                                        onClick={() => setShowMore(!showMore)}
                                    >
                                        {showMore ? "show less" : "show more"}
                                    </span>
                                </>
                            )}
                        </TypographyP>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ReviewsSection = () => {
    const params = useParams();
    const bookId = params?.id as string;

    const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
    const [reviews, setReviews] = useState<BookRatingResponse[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (!bookId || !hasMore) return;

        const controller = new AbortController();
        const signal = controller.signal;

        setReviewsLoading(true);
        getBookRatings(bookId, signal, page)
            .then((res) => {
                if (!res || res.length === 0) {
                    setHasMore(false);
                } else {
                    setReviews((prev) => [...prev, ...res]);
                }
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                }
            })
            .finally(() => setReviewsLoading(false));

        return () => controller.abort(CancelAbortMsg);
    }, [bookId, page, hasMore]);

    return (
        <div className="flex flex-col gap-2">
            <HeadingWithUnderline text="Reviews & Ratings" />
            <ReviewInputForm />
            <div className="mt-10 flex flex-col items-center gap-2 w-full">
                {!reviewsLoading && reviews.length === 0 && (
                    <TypographyP isMuted>
                        No reviews yet. Be the first to rate this book!
                    </TypographyP>
                )}
                {reviews.length > 0 &&
                    reviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                {reviewsLoading && <ThreeDotLoading />}

                <div className="flex items-center justify-center w-full h-14">
                    {!reviewsLoading && hasMore && (
                        <Button
                            variant={"ghost"}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Load More
                        </Button>
                    )}
                    {!hasMore && reviews.length > 0 && (
                        <TypographySmall isMuted className="w-full text-center">
                            No more reviews
                        </TypographySmall>
                    )}
                </div>
            </div>
        </div>
    );
};

const Page = () => {
    const params = useParams();
    const id = params?.id as string;
    const [book, setBook] = useState<BookResponse>();
    const [loadingBook, setLoadingBook] = useState<boolean>(true);
    const [isError, setErrorBook] = useState<boolean>(false);

    useEffect(() => {
        if (id && book) {
            setLoadingBook(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        setLoadingBook(true);
        getBookById(id, signal)
            .then((res) => {
                setBook(res);
            })
            .catch((err) => {
                if (err !== CancelAbortMsg) {
                    toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive",
                    });
                    setErrorBook(true);
                }
            })
            .finally(() => setLoadingBook(false));

        return () => controller.abort(CancelAbortMsg);
    }, []);
    return (
        <PageLayout>
            {isError && <ErrorPage code={500} message="Something went wrong" />}
            {loadingBook && <LoaderPage />}
            {book && (
                <div className="flex flex-col gap-5 mt-4">
                    <BookDetailsSection book={book} />
                    <RelatedBooksSection />
                    <ReviewsSection />
                </div>
            )}
        </PageLayout>
    );
};

export default Page;
