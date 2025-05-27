import { useEffect, useState } from "react"
import { getSections } from "../../services/lessonService";

// Hàm lấy danh sách section dựa trên lesson ID
export const useSections = (lessonId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [listSection, setListSection] = useState([]);

    useEffect(() => {
        const getListSection = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getSections(lessonId);

                if (!data) {
                    setError('Không tìm thấy thông tin danh sách phần học.');
                    return;
                }

                const sortedSections = [...data].sort((a, b) => a.viTri - b.viTri);
                setListSection(sortedSections);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            } finally {
                setLoading(false);
            }
        }

        getListSection();
    }, [lessonId]);

    return { loading, error, listSection }
}