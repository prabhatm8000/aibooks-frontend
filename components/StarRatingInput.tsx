import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "./ui/button";

interface StarRatingInputProps {
    value: number;
    onChange: (newRating: number) => void;
    outOf: number;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
    value,
    onChange,
    outOf,
}) => {
    const [hovered, setHovered] = useState<number | null>(null);

    const handleMouseEnter = (index: number) => {
        setHovered(index);
    };

    const handleMouseLeave = () => {
        setHovered(null);
    };

    const handleClick = (index: number) => {
        onChange(index);
    };

    return (
        <div className="flex gap-2 items-center">
            {Array.from({ length: outOf }).map((_, star) => (
                <Star
                    key={star + 1}
                    size={24}
                    onMouseEnter={() => handleMouseEnter(star + 1)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(star + 1)}
                    fill={star + 1 <= (hovered || value) ? "gold" : "none"}
                    stroke={
                        star + 1 <= (hovered || value) ? "gold" : "currentColor"
                    }
                    className="cursor-pointer"
                />
            ))}
            <Button className="py-1 px-2 h-fit w-fit" onClick={() => handleClick(0)}>clear</Button>
        </div>
    );
};

export default StarRatingInput;
