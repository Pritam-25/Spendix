"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

const useFetch = <T, Args extends any[]>(
    callback: (...args: Args) => Promise<T>
) => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async (...args: Args) => {
        setLoading(true);
        setError(null);

        try {
            const response = await callback(...args);
            setData(response);
            return response; // Return data for potential chaining
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : "An unexpected error occurred";
            const error = new Error(errorMessage);
            setError(error);
            toast.error(error.message);
            return null; // Ensure function always returns something
        } finally {
            setLoading(false);
        }
    }, [callback]);

    return { data, loading, error, fetchData, setData };
};

export default useFetch;