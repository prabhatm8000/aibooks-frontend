"use client";

import ErrorPage from "@/components/ErrorPage";
import HeadingWithUnderline from "@/components/HeadingWithUnderline";
import LoaderPage from "@/components/Loader/LoaderPage";
import ThreeDotLoading from "@/components/Loader/ThreeDotLoading";
import StarRating from "@/components/StarRating";
import StarRatingInput from "@/components/StarRatingInput";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/buttonlink";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    TypographyH1,
    TypographyH3,
    TypographyH5,
    TypographyP,
    TypographySmall,
} from "@/components/ui/typography";
import UserAvtar from "@/components/UserAvtar";
import {
    addBookRating,
    deleteBookRating,
    getBookById,
    getBookRatings,
    myRatingForBook,
} from "@/lib/apiClient";
import type { BookRatingResponse, BookResponse } from "@/lib/apiResponseTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const BookDetailsSection = ({ book }: { book: BookResponse }) => {
    return (
        <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4 h-full">
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
                    <StarRating rating={3.7} outOf={5} />
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
                            variant={"default"}
                            className="text-lg font-bold"
                        >
                            Add to Library
                        </Button>
                    </div>
                    <TypographyP isMuted>{book.summary}</TypographyP>
                </div>
            </div>
        </div>
    );
};

const RelatedBooksSection = ({ books }: { books: BookResponse[] }) => {};

const FormSchema = z.object({
    review: z.string().trim(),
    rating: z.number().min(0).max(5),
});
function ReviewInputForm() {
    const params = useParams();
    const bookId = params?.id as string;

    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [gotPrevRating, setGotPrevRating] = useState(false);
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

        setSubmitLoading(true);
        addBookRating({
            bookId: bookId,
            rating: v.rating,
            review: v.review,
        })
            .catch((err) => console.error("Error submitting review:", err))
            .finally(() => setSubmitLoading(false));
    };

    const handleDeleteRating = () => {
        if (!bookId || !prevRating) return;

        setIsDeleting(true);
        deleteBookRating(prevRating.id)
            .then((res) => {
                console.log(res);
                setGotPrevRating(false);
                setPrevRating(null);
                form.setValue("rating", 0);
                form.setValue("review", "");
            })
            .catch((err) => console.error(err))
            .finally(() => setIsDeleting(false));
    };

    useEffect(() => {
        if (!bookId) return;
        
        const controller = new AbortController();
        const signal = controller.signal;

        myRatingForBook(bookId, signal).then((res) => {
            setPrevRating(res);
            form.setValue("rating", res.rating);
            form.setValue("review", res.review);
            setGotPrevRating(true);
        });
        return () => controller.abort();
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
                                    {gotPrevRating && (
                                        <Button
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
                    {gotPrevRating
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
                <span className="w-7 h-7 py-1">
                    <UserAvtar size={40} user={review.user} />
                </span>
                <div className="flex flex-col items-start justify-start gap-2 w-fit">
                    <div className="flex flex-col items-start">
                        <TypographyH5>{review.user.name}</TypographyH5>
                        <TypographySmall isMuted>
                            {review.user.nickname}
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
                if (err.name !== "AbortError") {
                    console.error("Error fetching reviews:", err);
                }
            })
            .finally(() => setReviewsLoading(false));

        return () => controller.abort();
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
                    {!hasMore && (
                        <TypographySmall isMuted className="w-full text-center">
                            No more reviews
                        </TypographySmall>
                    )}
                </div>
            </div>
        </div>
    );
};

const page = () => {
    const params = useParams();
    const id = params?.id as string;
    const [book, setBook] = useState<BookResponse>();
    const [loadingBook, setLoadingBook] = useState<boolean>(true);

    useEffect(() => {
        if (!id || book) {
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
            .finally(() => setLoadingBook(false));

        return () => controller.abort();
    }, []);
    return (
        <>
            {!book && !loadingBook && (
                <ErrorPage code={500} message="Something went wrong" />
            )}
            {loadingBook && <LoaderPage />}
            {book && (
                <div className="flex flex-col gap-5 mt-4">
                    <BookDetailsSection book={book} />
                    <ReviewsSection />
                </div>
            )}
        </>
    );
};

export default page;
