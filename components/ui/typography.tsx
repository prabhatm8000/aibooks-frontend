export function TypographyH1({
    children,
    isMuted,
}: {
    children: React.ReactNode;
    isMuted?: boolean;
}) {
    return (
        <h1
            className={`scroll-m-20 text-6xl font-extrabold tracking-tight lg:text-5xl xl:text-6xl 2xl:text-7xl ${
                isMuted ? "text-muted-foreground" : ""
            }`}
        >
            {children}
        </h1>
    );
}

export function  TypographyH2({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h2
            className={
                "scroll-m-20 text-3xl font-semibold tracking-tight " +
                className
            }
        >
            {children}
        </h2>
    );
}

export function TypographyH3({
    children,
    isMuted,
}: {
    children: React.ReactNode;
    isMuted?: boolean;
}) {
    return (
        <h3
            className={`scroll-m-20 text-2xl font-semibold tracking-tight ${
                isMuted ? "text-muted-foreground" : ""
            }`}
        >
            {children}
        </h3>
    );
}

export function TypographyH4({
    children,
    isMuted,
}: {
    children: React.ReactNode;
    isMuted?: boolean;
}) {
    return (
        <h4
            className={`scroll-m-20 text-xl font-semibold tracking-tight ${
                isMuted ? "text-muted-foreground" : ""
            }`}
        >
            {children}
        </h4>
    );
}

export function TypographyH5({
    children,
    isMuted,
}: {
    children: React.ReactNode;
    isMuted?: boolean;
}) {
    return (
        <h5
            className={`scroll-m-20 font-semibold tracking-tight ${
                isMuted ? "text-muted-foreground" : ""
            }`}
        >
            {children}
        </h5>
    );
}

export function TypographyP({
    children,
    isMuted,
    className,
}: {
    children: React.ReactNode;
    isMuted?: boolean;
    className?: string;
}) {
    return (
        <p
            className={`${className} leading-5 ${
                isMuted ? "text-muted-foreground" : ""
            }`}
        >
            {children}
        </p>
    );
}

export function TypographySmall({
    children,
    isMuted,
}: {
    children: React.ReactNode;
    isMuted?: boolean;
}) {
    return (
        <small
            className={`text-sm font-medium leading-none ${
                isMuted ? "text-muted-foreground" : ""
            }`}
        >
            {children}
        </small>
    );
}

export function TypographyBlockquote({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
        </blockquote>
    );
}
