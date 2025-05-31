import { useEffect, useRef } from "react";

const useDraggableScroll = () => {
    const containerRef = useRef(null);
    let isDragging = false;
    let startX;
    let scrollLeft;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseDown = (e) => {
            isDragging = false;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.cursor = "grabbing";
            container.addEventListener("mousemove", handleMouseMove);
        };

        const handleMouseMove = (e) => {
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            if (Math.abs(walk) > 10) isDragging = true;
            container.scrollLeft = scrollLeft - walk;
        };

        const handleMouseUp = () => {
            isDragging = false;
            container.style.cursor = "grab";
            container.removeEventListener("mousemove", handleMouseMove);
        };

        const handleMouseLeave = () => {
            isDragging = false;
            container.removeEventListener("mousemove", handleMouseMove);
        };

        const handleClick = (e) => {
            if (isDragging) e.preventDefault();
        };

        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("mouseup", handleMouseUp);
        container.addEventListener("mouseleave", handleMouseLeave);
        container.addEventListener("click", handleClick);

        return () => {
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("mouseup", handleMouseUp);
            container.removeEventListener("mouseleave", handleMouseLeave);
            container.removeEventListener("click", handleClick);
        };
    }, []);

    return containerRef;
};

export default useDraggableScroll;