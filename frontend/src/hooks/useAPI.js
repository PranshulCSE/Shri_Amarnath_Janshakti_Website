import { useState, useCallback } from 'react';

/**
 * Custom hook for making API calls with loading and error states
 * @param {Function} apiFunction - The API function to call
 * @returns {Object} { execute, data, loading, error }
 */
export const useAPI = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(
        async (...args) => {
            try {
                setLoading(true);
                setError(null);
                const response = await apiFunction(...args);
                setData(response.data);
                return response.data;
            } catch (err) {
                const errorMessage =
                    err.response?.data?.message || err.message || 'An error occurred';
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [apiFunction]
    );

    return { execute, data, loading, error };
};

export default useAPI;
