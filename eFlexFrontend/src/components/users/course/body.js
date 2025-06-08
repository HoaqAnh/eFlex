import { useEffect, useState, useRef, useCallback } from "react";
import Item from "./item";
import SkeletonItem from "./skeletonItem";
import Loading from "../../../components/layout/loader/loading";
import Error from "../../../components/layout/loader/error";
import "../../../styles/users/course/body.css";

const Body = ({ courseData, loading, error, isSelectingCourse, selectedCourseId, onSelectCourse, hideUnselected, onLoadMore, hasMore, isFiltering, isSearching }) => {
    const [loadingAnimation, setLoadingAnimation] = useState(true);
    const [prevCourseCount, setPrevCourseCount] = useState(2);

    const observer = useRef();
    const lastCourseElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                onLoadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, onLoadMore]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingAnimation(false);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (courseData && Array.isArray(courseData) && courseData.length > 0) {
            setPrevCourseCount(courseData.length);
        }
    }, [courseData]);

    if (loadingAnimation) {
        return (
            <div className="course-body">
                <div className="course-body__container">
                    {Array.from({ length: prevCourseCount }).map((_, index) => (
                        <SkeletonItem key={index} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="course-body"><Error Title="Có lỗi khi tải khóa học. Vui lòng thử lại sau ít phút!" /></div>
    }

    if (!courseData || !Array.isArray(courseData) || courseData.length === 0) {
        if (isSearching) {
            return <div className="course-body"><Loading Title="Không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn." /></div>
        }
        if (isFiltering) {
            return <div className="course-body"><Loading Title="Không tìm thấy khóa học cho danh mục này." /></div>
        }
        return <div className="course-body"><Loading Title="Không tìm thấy khóa học nào. Vui lòng thử lại sau ít phút!" /></div>
    }

    const displayCourses = hideUnselected && selectedCourseId
        ? courseData.filter(course => course.id === selectedCourseId)
        : courseData;

    return (
        <div className="course-body">
            {isSelectingCourse && (
                <div className="course-selection-mode">
                    <p>Chọn một khóa học để bắt đầu</p>
                </div>
            )}

            <div className="course-body__container">
                {displayCourses.map((courseItem, index) => {
                    if (displayCourses.length === index + 1) {
                        return (
                            <div ref={lastCourseElementRef} key={courseItem.id}>
                                <Item
                                    course={courseItem}
                                    isSelectingCourse={isSelectingCourse}
                                    isSelected={selectedCourseId === courseItem.id}
                                    onSelectCourse={onSelectCourse}
                                    animationDelay={index * 150}
                                />
                            </div>
                        );
                    } else {
                        return (
                            <Item
                                key={courseItem.id}
                                course={courseItem}
                                isSelectingCourse={isSelectingCourse}
                                isSelected={selectedCourseId === courseItem.id}
                                onSelectCourse={onSelectCourse}
                                animationDelay={index * 150}
                            />
                        );
                    }
                })}
            </div>
            {/* {loading && courseData.length > 0 && <Loading Title="Đang tải thêm khóa học..." />}
            {!hasMore && courseData.length > 0 && !isSearching && isFiltering && (
                <div className="course-body__no-more">
                    Đã hiển thị tất cả khóa học cho danh mục này.
                </div>
            )}
            {!hasMore && courseData.length > 0 && isSearching && (
                <div className="course-body__no-more">
                    Đã hiển thị tất cả kết quả tìm kiếm.
                </div>
            )} */}
        </div>
    );
};

export default Body;