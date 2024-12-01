import type { BookResponse } from "@/lib/apiResponseTypes";
import { CloudAlertIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type LegacyRef } from "react";
import { TypographyP, TypographySmall } from "./ui/typography";
import LoadingSpinner from "./Loader/LoadingSpinner";

const BookCard = ({
    book,
    ref,
    children,
    className,
}: {
    book: BookResponse;
    ref?: LegacyRef<HTMLDivElement>;
    children?: React.ReactNode;
    className?: string;
}) => {
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div
            key={book.id}
            title={book.title}
            ref={ref}
            className={`w-full h-full rounded-lg p-4 border border-muted hover:bg-muted on-view-animation ${className}`}
        >
            <Link
                href={`/book/byId/${book.id}`}
                className="flex flex-col items-start gap-2"
                onClick={() => setLoading(true)}
            >
                <div className="relative aspect-[13/19] w-full">
                    {imageError ? (
                        <CloudAlertIcon className="absolute inset-0 m-auto" />
                    ) : (
                        <Image
                            src={book.coverImage.url}
                            alt={book.title}
                            width={book.coverImage.width.large}
                            height={book.coverImage.height.large}
                            loading="eager"
                            className={`object-cover rounded-md aspect-[13/19] size-full ${
                                imageError ? "hidden" : ""
                            } ${loading ? "blur-sm" : ""}`}
                            onError={() => setImageError(true)}
                        />
                    )}
                    <div
                        className={`absolute rounded-md aspect-[13/19] top-0 w-full h-full bg-background ${
                            loading ? "opacity-70 blur-lg" : "opacity-0"
                        }`}
                    ></div>
                    {loading && (
                        <div className="absolute inset-0 m-auto flex justify-center items-center">
                            <LoadingSpinner className="w-16 h-16" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-start justify-center gap-2">
                    <TypographyP className="line-clamp-1">
                        {book.title}
                    </TypographyP>
                    <TypographySmall className="line-clamp-1" isMuted>
                        {book.genre.join(", ")}
                    </TypographySmall>
                    <TypographySmall className="" isMuted>
                        Released on:{" "}
                        {new Date(book.createdAt).toLocaleDateString()}
                    </TypographySmall>

                    <div className="flex flex-row items-end gap-2">
                        <span className="flex flex-row items-end gap-1">
                            <TypographySmall isMuted>
                                {book.rating.toFixed(1)}
                            </TypographySmall>
                            <Star
                                size={16}
                                style={{
                                    fill: "hsl(var(--muted-foreground))",
                                    stroke: "hsl(var(--muted-foreground))",
                                }}
                                className="cursor-pointer"
                            />
                        </span>
                        <TypographySmall isMuted>
                            {book.totalRatings} Ratings
                        </TypographySmall>
                    </div>
                </div>
            </Link>
            {children}
        </div>
    );
};
export default BookCard;
