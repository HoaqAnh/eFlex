import { useState, useEffect } from 'react';
import { getAllCategory } from '../services/categoryService';

export const useCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const categoryData = await getAllCategory();
                
                if (!categoryData) {
                    throw new Error('Không thể kết nối đến máy chủ');
                }
                
                if (!categoryData.data || !Array.isArray(categoryData.data)) {
                    throw new Error('Dữ liệu danh mục không hợp lệ');
                }
                
                setCategories(categoryData.data);
            } catch (err) {
                console.error('Error fetching category:', err);
                setError(err.message || 'Không thể tải danh sách danh mục. Vui lòng thử lại sau.');
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
};
