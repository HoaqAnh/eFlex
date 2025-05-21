import React, { useState, useCallback, useMemo } from "react";
import Header from "../../../components/users/course/header";
import Body from "../../../components/users/course/body";
import { useAdminCourse } from "../../../hooks/course/useCourse";
import { useAuth } from "../../../hooks/useAuth";
import "../../../styles/users/course/style.css";
import { useCategory, useFilterCategory } from "../../../hooks/course/useCategory.js";

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const Course = () => {
    const { checkAuth } = useAuth();
    const { courseData: allCoursesData, loading: allCoursesLoading, error: allCoursesError } = useAdminCourse();
    const authCheck = checkAuth();
    const { categoryData, loading: categoryLoading, error: categoryError } = useCategory();

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [paginationParams, setPaginationParams] = useState({ page: 0 });
    const { filterData, loading: filterLoading, error: filterError, hasMore,
    } = useFilterCategory(selectedCategoryId, paginationParams);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const debouncedSetSearch = useCallback(debounce(setDebouncedSearchTerm, 300), []);
    const handleSearchChange = useCallback((newSearchTerm) => {
        setSearchTerm(newSearchTerm);
        debouncedSetSearch(newSearchTerm);
    }, [debouncedSetSearch]);

    const handleCategoryChange = useCallback((categoryId) => {
        if (categoryId === "") {
            setSelectedCategoryId(null);
        } else {
            setSelectedCategoryId(categoryId);
        }
        setPaginationParams({ page: 0 });
    }, []);

    const loadMoreItems = useCallback(() => {
        if (selectedCategoryId && !filterLoading && hasMore) {
            setPaginationParams(prevParams => ({ ...prevParams, page: prevParams.page + 1 })); //
        }
    }, [selectedCategoryId, filterLoading, hasMore]);

    const baseDataForSearch = useMemo(() => {
        return selectedCategoryId ? filterData : allCoursesData;
    }, [selectedCategoryId, filterData, allCoursesData]);

    const finalDisplayCourseData = useMemo(() => {
        if (!baseDataForSearch) return [];
        if (!debouncedSearchTerm.trim()) {
            return baseDataForSearch;
        }

        return baseDataForSearch.filter(course =>
            course.tenMon && course.tenMon.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [baseDataForSearch, debouncedSearchTerm]);

    if (!authCheck.shouldRender) {
        return authCheck.component;
    }

    const displayLoading = selectedCategoryId ? filterLoading : allCoursesLoading;
    const displayError = selectedCategoryId ? filterError : allCoursesError;
    const displayHasMore = selectedCategoryId ? hasMore : false;

    return (
        <div className="course">
            <Header
                categoryData={categoryData}
                onCategoryChange={handleCategoryChange}
                selectedCategoryId={selectedCategoryId}
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
            />
            <Body
                courseData={finalDisplayCourseData}
                loading={displayLoading}
                error={displayError}
                onLoadMore={loadMoreItems}
                hasMore={displayHasMore}
                isFiltering={!!selectedCategoryId}
                isSearching={!!debouncedSearchTerm.trim()}
            />
        </div>
    );
}

export default Course;