const ErrorPage = ({ code, message }: { code?: number; message: string }) => {
    return (
        <div
            className={`${
                code === 404
                    ? "h-[calc(100vh-250px)] md:h-[calc(100vh-200px)]"
                    : "h-[calc(100%-250px)] md:h-[calc(100%-200px)]"
            } flex items-center justify-center`}
        >
            <div className="flex">
                {code && (
                    <span className="border-r border-muted-foreground inline-block mr-5 px-5 text-2xl font-semibold leading-none">
                        {code}
                    </span>
                )}
                <div className="inline-block">
                    <span className="text-sm font-normal leading-none m-0">
                        {message}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
