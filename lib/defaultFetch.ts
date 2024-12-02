import { toast } from "@/hooks/use-toast";

let urlBackend: string;

switch (process.env.NEXT_PUBLIC_MODE) {
    case "dev":
        urlBackend = process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || "";
        break;
    case "prod":
        urlBackend = process.env.NEXT_PUBLIC_PROD_BACKEND_URL || "";
        break;
    default:
        throw new Error("Invalid mode");
}

export const defaultFetch = async (
    endpoint: string,
    options?: RequestInit
): Promise<Response> => {
    if (!urlBackend) {
        throw new Error("Invalid mode or backend URL");
    }

    options = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        credentials: "include",
    };

    const res = await fetch(`${urlBackend}/api/v1/${endpoint}`, options);

    if (!res.ok) {
        toast({
            title: "Error",
            description: res.statusText || "Uh oh! Something went wrong",
            variant: "destructive",
        });
        throw new Error(res.statusText);
    }

    return res;
};
