import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook để theo dõi thời gian người dùng ở trên trang
 * @param {Function} onExit - Callback được gọi khi người dùng rời khỏi trang, với tổng thời gian (giây) làm tham số
 * @param {string} courseId - ID của khóa học đang xem
 * @returns {Object} Đối tượng chứa thời gian hiện tại (tính bằng giây) và các thông tin khác
 */
const useCourseStudyTimer = (onExit, courseId) => {
  // Thời gian hiện tại mà người dùng đã ở trên trang (seconds)
  const [currentTime, setCurrentTime] = useState(() => {
    // Khôi phục thời gian từ localStorage nếu có
    const savedTime = localStorage.getItem(`course_${courseId}_time`);
    return savedTime ? parseInt(savedTime, 10) : 0;
  });
  
  // Tích lũy thời gian trước khi người dùng tạm dừng hoạt động
  const accumulatedTimeRef = useRef(currentTime);
  
  // Thời điểm bắt đầu đếm
  const startTimeRef = useRef(null);
  
  // Cờ để biết người dùng có đang hoạt động trên trang không
  const isActiveRef = useRef(true);
  
  // Biến này sẽ được dùng để đảm bảo chỉ gọi onExit khi người dùng thoát trang
  const hasStartedRef = useRef(false);
  
  // Tham chiếu đến callback onExit để tránh re-renders không cần thiết
  const onExitRef = useRef(onExit);
  
  // Tham chiếu đến courseId
  const courseIdRef = useRef(courseId);
  
  // Cập nhật tham chiếu khi callback hoặc courseId thay đổi
  useEffect(() => {
    onExitRef.current = onExit;
    courseIdRef.current = courseId;
  }, [onExit, courseId]);

  // Định dạng thời gian thành HH:MM:SS
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  }, []);

  // Cập nhật thời gian hiện tại người dùng đã ở trên trang
  const updateCurrentTime = useCallback(() => {
    if (isActiveRef.current && startTimeRef.current) {
      const now = new Date().getTime();
      const elapsedMilliseconds = now - startTimeRef.current;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      // Tổng thời gian = thời gian đã tích lũy + thời gian hiện tại
      const updatedTime = accumulatedTimeRef.current + elapsedSeconds;
      setCurrentTime(updatedTime);
      
      // Lưu thời gian vào localStorage
      localStorage.setItem(`course_${courseIdRef.current}_time`, updatedTime.toString());
      
      // Đánh dấu đã bắt đầu theo dõi khi có thời gian > 0
      if (updatedTime > 0 && !hasStartedRef.current) {
        hasStartedRef.current = true;
      }
    }
  }, []);

  // Hàm để thu thập tổng thời gian và gọi callback onExit
  const collectTotalTime = useCallback(() => {
    if (isActiveRef.current && startTimeRef.current) {
      const now = new Date().getTime();
      const elapsedMilliseconds = now - startTimeRef.current;
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      const totalSeconds = accumulatedTimeRef.current + elapsedSeconds;
      
      // Chỉ gọi callback nếu đã thực sự có thời gian hoạt động
      if (hasStartedRef.current && totalSeconds > 0 && onExitRef.current && typeof onExitRef.current === 'function') {
        onExitRef.current(totalSeconds);
        // Xóa thời gian đã lưu khi kết thúc
        localStorage.removeItem(`course_${courseIdRef.current}_time`);
      }
      
      return totalSeconds;
    }
    return accumulatedTimeRef.current;
  }, []);

  // Khởi tạo theo dõi khi component được mount
  useEffect(() => {
    // Thời điểm bắt đầu
    startTimeRef.current = new Date().getTime();
    isActiveRef.current = true;

    // Sự kiện khi người dùng chuyển đổi tab/visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Người dùng rời khỏi trang/tab - tạm dừng đếm
        if (isActiveRef.current && startTimeRef.current) {
          const now = new Date().getTime();
          const elapsedMilliseconds = now - startTimeRef.current;
          const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
          
          // Tích lũy thời gian đã trôi qua
          accumulatedTimeRef.current += elapsedSeconds;
          
          // Cập nhật thời gian hiện tại
          setCurrentTime(accumulatedTimeRef.current);
          
          // Lưu thời gian vào localStorage
          localStorage.setItem(`course_${courseIdRef.current}_time`, accumulatedTimeRef.current.toString());
          
          // Đánh dấu không còn hoạt động
          isActiveRef.current = false;
        }
      } else {
        // Người dùng quay lại trang - tiếp tục đếm từ thời điểm hiện tại
        startTimeRef.current = new Date().getTime();
        isActiveRef.current = true;
      }
    };

    // Theo dõi hoạt động của người dùng
    const handleUserActivity = () => {
      // Nếu người dùng đang không hoạt động, bắt đầu đếm lại
      if (!isActiveRef.current) {
        startTimeRef.current = new Date().getTime();
        isActiveRef.current = true;
      }
    };

    // Sự kiện khi người dùng sắp đóng trang
    const handleBeforeUnload = () => {
      // Chỉ gọi khi người dùng thực sự đóng cửa sổ/tab
      collectTotalTime();
    };

    // Đăng ký các sự kiện
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Đăng ký các sự kiện người dùng hoạt động
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity);
    });

    // Cập nhật thời gian mỗi giây
    const intervalId = setInterval(() => {
      updateCurrentTime();
    }, 1000);

    // Cleanup khi component unmount
    return () => {
      // Chỉ gọi collectTotalTime nếu người dùng thực sự rời khỏi khóa học
      const currentPath = window.location.pathname;
      const isStillInCourse = currentPath.includes(`/course/${courseIdRef.current}`);
      const isInLessonOfSameCourse = currentPath.includes(`/course/${courseIdRef.current}/lesson/`);
      
      if (!isStillInCourse && !isInLessonOfSameCourse) {
        collectTotalTime();
      }
      
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Gỡ bỏ đăng ký sự kiện hoạt động
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity);
      });
    };
  }, [collectTotalTime, updateCurrentTime]);

  return {
    currentTimeInSeconds: currentTime, // Thời gian hiện tại tính bằng giây
    formattedTime: formatTime(currentTime), // Thời gian đã định dạng HH:MM:SS
    collectTotalTime, // Hàm để thu thập tổng thời gian truy cập theo yêu cầu
    isActive: isActiveRef.current // Trạng thái hoạt động hiện tại
  };
};

export default useCourseStudyTimer;