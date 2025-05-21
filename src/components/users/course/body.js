import React, { useEffect, useState, useRef, useCallback } from "react";
import Item from "./item";
import SkeletonItem from "./skeletonItem"; 
import Loading from "../../../components/layout/loader/loading";
import "../../../styles/users/course/body.css"; 

const Body = ({ courseData, loading, error, isSelectingCourse, selectedCourseId, onSelectCourse, hideUnselected, onLoadMore, hasMore, isFiltering }) => {
    const [loadingAnimation, setLoadingAnimation] = useState(true); 
    const [prevCourseCount, setPrevCourseCount] = useState(6);

    const observer = useRef();
    const lastCourseElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && isFiltering) {
                onLoadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, onLoadMore, isFiltering]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingAnimation(false);
        }, 700);

        return () => clearTimeout(timer); 
    }, []);

    useEffect(() => {
        if (loading) {
            setLoadingAnimation(true);
        } else if (!loading && courseData && courseData.length > 0) {
            const timer = setTimeout(() => setLoadingAnimation(false), 300);
            return () => clearTimeout(timer);
        } else if (!loading && (!courseData || courseData.length === 0)) {
            setLoadingAnimation(false);
        }
    }, [loading, courseData]);

    useEffect(() => {
        if (loading && (!courseData || courseData.length === 0)) {
            setPrevCourseCount(6);
        }
    }, [loading, courseData]);


    if (loadingAnimation && (!courseData || courseData.length === 0)) {
        return (
            <div className="course-body">
                <div className="course-body__container">
                    {Array.from({ length: prevCourseCount }).map((_, index) => (
                        <SkeletonItem key={`skeleton-${index}`} />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="course-body__container">Lỗi khi tải khóa học: {error}. Vui lòng thử lại sau.</div>; 
    }

    if (!courseData || !Array.isArray(courseData) || courseData.length === 0) {
        return <Loading Title={isFiltering ? "Không tìm thấy khóa học cho danh mục này." : "Không tìm thấy khóa học nào. Vui lòng thử lại sau ít phút!"} />; 
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
                    if (isFiltering && displayCourses.length === index + 1) {
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
            {isFiltering && loading && courseData.length > 0 && <Loading Title="Đang tải thêm khóa học..." />}
            {isFiltering && !hasMore && courseData.length > 0 && <div className="course-body__no-more">Đã hiển thị tất cả khóa học.</div>}
        </div>
    );
};

export default Body;