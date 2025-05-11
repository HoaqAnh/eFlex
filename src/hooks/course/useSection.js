import { getSections } from "../../services/lessonService";

export const useSections = (lessonId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sectionsData, setSectionsData] = useState([]);

    useEffect(() => {
        const getSectionsData = async () => {
            try {
                setLoading(true);
                setError(false);

                const data = await getSections(lessonId);

                if (!data) {
                    setError('Không tìm thấy thông tin chi tiết bài học.');
                    return;
                }

                const sortedSections = [...data].sort((a, b) => a.viTri - b.viTri);
                setSectionsData(sortedSections);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Có lỗi xảy ra khi lấy dữ liệu.');
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        }

        getSectionsData();
    }, [lessonId]);

    return { loading, error, sectionsData }
}