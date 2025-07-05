import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useFetch = (fetchFn, params, deps = [], options = { notifyError: true }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchFn(params);
                if (isMounted) {
                    if (res.status) {
                        setData(res.data);
                        setError(null);
                    } else {
                        const errMsg = res.mess || "Có lỗi xảy ra!";
                        setError(errMsg);
                        if (options.notifyError) toast.error(errMsg);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message);
                    if (options.notifyError) toast.error(err.message || "Lỗi hệ thống!");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => { isMounted = false };
    }, deps.length ? deps : [JSON.stringify(params)]);

    return { data, loading, error };
};
