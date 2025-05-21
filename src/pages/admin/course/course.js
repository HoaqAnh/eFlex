import { useState, useCallback, useMemo } from "react";
import Header from "../../../components/users/course/header";
import { useAuth } from "../../../hooks/useAuth";
import { useAdminCourse } from "../../../hooks/course/useCourse"
import { useCategory, useFilterCategory } from "../../../hooks/course/useCategory.js";
import Body from "../../../components/users/course/body";
import Footer from "../../../components/admin/course/footer";
import ConfirmDialog from "../../../components/admin/course/confirmDialog";
import "../../../styles/admin/course/style.css";
import Loading from "../../../components/layout/loader/loading.js";
import Error from "../../../components/layout/loader/error.js";

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
    const authCheck = checkAuth();

    const [paginationParamsForAll, setPaginationParamsForAll] = useState({ page: 0 });
    const { handleNavigate, handleDelete, courseData: allCoursesDataFromHook, loading: allCoursesLoading, error: allCoursesError, hasMore: hasMoreAllCourses,
    } = useAdminCourse(paginationParamsForAll);

    const { categoryData, loading: categoryLoading, error: categoryError } = useCategory();

    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [paginationParamsForFilter, setPaginationParamsForFilter] = useState({ page: 0 });
    const { filterData, loading: filterLoading, error: filterError, hasMore: hasMoreFiltered,
    } = useFilterCategory(selectedCategoryId, paginationParamsForFilter);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const debouncedSetSearch = useMemo(() => debounce(setDebouncedSearchTerm, 300), []);

    const [isSelectingCourse, setIsSelectingCourse] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [hideUnselected, setHideUnselected] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleToggleSelectCourse = () => {
        setIsSelectingCourse(!isSelectingCourse);
        if (isSelectingCourse) {
            setSelectedCourseId(null);
        }
    };

    const handleSelectCourse = (courseId) => {
        setSelectedCourseId(courseId);
        setHideUnselected(!hideUnselected);
        setIsSelectingCourse(false);
    };

    const handleUnselectCourse = () => {
        setSelectedCourseId(null);
        setHideUnselected(false);
    };

    const handleToggleHideUnselected = () => {
        setHideUnselected(!hideUnselected);
    };

    const onDeleteClick = () => {
        if (selectedCourseId) {
            setIsConfirmOpen(true);
        }
    };

    const closeConfirmDialog = () => {
        setIsConfirmOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (selectedCourseId) {
            const success = await handleDelete(selectedCourseId);
            if (success) {
                setSelectedCourseId(null);
                setHideUnselected(false);
            }
        }
        setIsConfirmOpen(false);
    };

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
        setPaginationParamsForAll({ page: 0 });
        setPaginationParamsForFilter({ page: 0 });
    }, []);

    const loadMoreItems = useCallback(() => {
        if (selectedCategoryId) {
            if (!filterLoading && hasMoreFiltered) {
                setPaginationParamsForFilter(prevParams => ({ ...prevParams, page: prevParams.page + 1 }));
            }
        } else {
            if (!allCoursesLoading && hasMoreAllCourses) {
                setPaginationParamsForAll(prevParams => ({ ...prevParams, page: prevParams.page + 1 }));
            }
        }
    }, [selectedCategoryId, filterLoading, hasMoreFiltered, allCoursesLoading, hasMoreAllCourses]);

    const baseDataForSearch = useMemo(() => {
        return selectedCategoryId ? filterData : allCoursesDataFromHook;
    }, [selectedCategoryId, filterData, allCoursesDataFromHook]);

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

    if (categoryLoading) {
        return <div className="course"><Loading Title="Hệ thống đang chuẩn bị danh mục khóa học..." /></div>
    }

    if (categoryError) {
        return <div className="course"><Error Title="Có lỗi xảy khi trong quá trình lấy danh mục. Vui lòng thử lại sau ít phút!" /></div>
    }

    const displayLoading = selectedCategoryId ? filterLoading : allCoursesLoading;
    const displayError = selectedCategoryId ? filterError : allCoursesError;
    const displayHasMore = selectedCategoryId ? hasMoreFiltered : hasMoreAllCourses;

    return (
        <div className="admin-course">
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
                isSelectingCourse={isSelectingCourse}
                selectedCourseId={selectedCourseId}
                onSelectCourse={handleSelectCourse}
                hideUnselected={hideUnselected}
            />
            <Footer
                isSelectingCourse={isSelectingCourse}
                onToggleSelectCourse={handleToggleSelectCourse}
                onUnselectCourse={handleUnselectCourse}
                onToggleHideUnselected={handleToggleHideUnselected}
                courseId={selectedCourseId}
                hideUnselected={hideUnselected}
                onDeleteClick={onDeleteClick}
                handleAddCourse={() => handleNavigate("course/addCourse")}
                handlEditCourse={() => handleNavigate(`course/editCourse/${selectedCourseId}`)}
            />
            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={closeConfirmDialog}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa khóa học này?`}
            />
        </div >
    );
};

export default Course;