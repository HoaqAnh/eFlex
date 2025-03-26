import { useState, useEffect } from 'react';
import { getAllCourse } from '../services/CourseService';

export const useCourse = (pageSize = 5) => {
  const [listCourse, setListCourse] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchCourses = async (page) => {
    try {
      const data = await getAllCourse(page, pageSize);
      if (data) {
        setListCourse(data.data.result.content || []);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses(currentPage);
  }, [currentPage]);

  return {
    listCourse,
    currentPage,
    setCurrentPage,
    fetchCourses
  };
}; 