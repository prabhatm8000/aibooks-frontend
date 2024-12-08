import LoaderPage from "@/app/components/Loader/LoaderPage";

const loading = () => {
    return (
        <div className="h-screen">
            <div className="flex justify-center items-center h-full">
                <LoaderPage />
            </div>
        </div>
    );
};

export default loading;