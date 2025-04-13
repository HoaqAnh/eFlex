import { useState, useEffect } from 'react';

const BASE_URL = "http://localhost:8080/api/v1";

export const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                const response = await fetch(`${BASE_URL}/Category`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách danh mục');
                }

                const responseData = await response.json();

                const categoriesData = responseData.data;

                setCategories(categoriesData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
    };

    fetchCategories();
}, []);

return { categories, loading, error };
};
