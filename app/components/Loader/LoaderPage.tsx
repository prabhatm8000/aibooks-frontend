import ThreeDotLoading from "./ThreeDotLoading";

const LoaderPage = () => {
    return (
        <div className="flex justify-center items-center h-[calc(100%-250px)] md:h-[calc(100%-200px)]">
            <ThreeDotLoading />
        </div>
    );
};

export default LoaderPage;
