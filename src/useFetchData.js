import { useState, useEffect } from "react";

const useFetchData = (fetchFunction, dependencies) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchFunction();
        setData(result);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error };
};

export default useFetchData;
