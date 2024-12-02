import { Star } from "lucide-react";

const StarRating = ({ rating, outOf }: { rating: number; outOf: number }) => {
    const intPart = Math.floor(rating);
    const decimalPart = rating - intPart;

    return (
        <div className="flex gap-1">
            {Array.from({ length: outOf }).map((_, star) => {
                if (star < intPart) {
                    return (
                        <Star
                            key={star + 1}
                            size={16}
                            fill="gold"
                            stroke="gold"
                            className="cursor-pointer"
                        />
                    );
                } else if (star === intPart && decimalPart > 0) {
                    return (
                        <Star
                            key={star + 1}
                            size={16}
                            fill="gold"
                            stroke="gold"
                            className="cursor-pointer"
                            style={{
                                clipPath: `inset(0 ${
                                    100 - decimalPart * 100
                                }% 0 0)`,
                            }}
                        />
                    );
                } else {
                    return (
                        <Star
                            key={star + 1}
                            size={16}
                            fill="none"
                            stroke="currentColor"
                            className="cursor-pointer"
                        />
                    );
                }
            })}
        </div>
    );
};

export default StarRating;

