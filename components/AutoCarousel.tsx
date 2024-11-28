"use client";
import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export function AutoCarousel({
    cardContents,
    buttons,
}: {
    buttons?: boolean;
    cardContents: React.ReactNode[];
}) {
    const plugin = React.useRef(
        Autoplay({
            delay: 2000,
            stopOnInteraction: true,
            playOnInit: true,
            active: true,
        })
    );

    return (
        <Carousel
            plugins={[plugin.current]}
            className="w-full h-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent className="h-full flex items-center">
                {cardContents.map((cardContent, index) => (
                    <CarouselItem key={index}>{cardContent}</CarouselItem>
                ))}
            </CarouselContent>
            {buttons && (
                <>
                    <CarouselPrevious />
                    <CarouselNext />
                </>
            )}
        </Carousel>
    );
}
