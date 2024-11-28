import type { BookResponse } from "@/lib/apiResponseTypes";
import Image from "next/image";
import Link from "next/link";
import { TypographyP, TypographySmall } from "./ui/typography";
import { CloudAlertIcon } from "lucide-react";
import { useState } from "react";

const BookCard = ({ book }: { book: BookResponse }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <div
            key={book.id}
            className="w-full h-full rounded-lg p-4 border border-muted hover:bg-muted"
        >
            <Link
                href={`/book/byId/${book.id}`}
                className="flex flex-col items-center gap-2"
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
                            }`}
                            onError={() => setImageError(true)}
                        />
                    )}
                </div>
                <TypographyP className="text-center line-clamp-1">
                    {book.title}
                </TypographyP>
                <TypographySmall className="text-center line-clamp-1" isMuted>
                    {book.genre.join(", ")}
                </TypographySmall>
                <TypographySmall className="text-center" isMuted>
                    {new Date(book.createdAt).toLocaleDateString()}
                </TypographySmall>
            </Link>
        </div>
    );
};
export default BookCard;
