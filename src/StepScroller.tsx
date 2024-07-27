import { useEffect, useState } from "react";
import "./StepScroller.css";
import { useAnimate, motion } from "framer-motion";

const N = 20;
/**
 * Represents an array of items.
 * Each item is a string representation of a number from 1 to N.
 * The array is flattened with empty strings added after each item, except for the last item.
 */
const items = Array.from({ length: N }, (_, i) => (i + 1).toString()).flatMap(
  (item, index) => (index < N - 1 ? [item, "", "", "", ""] : [item])
);

/**
 * StepScroller component.
 *
 * This component provides a scrollable container with a draggable inner element.
 * It uses the `useAnimate` hook to animate the inner element's position based on mouse movement.
 *
 * @returns The StepScroller component.
 */
const StepScroller = () => {
  const [scope, animate] = useAnimate();
  const [currentX, setCurrentX] = useState(0);

  const handleMouseMove = (event: MouseEvent) =>
    setCurrentX((prev) => prev + event.movementX);

  const addMouseListeners = (element: HTMLElement) => {
    const handleMouseUp = () => {
      element.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const handleMouseDown = () => {
      element.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("scroll", handleMouseDown);
  };

  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".scroll-container"
    ) as HTMLElement;
    const halfwayX = scrollContainer.offsetWidth / 2;
    const draggableInner = document.querySelector(
      ".draggable-inner"
    ) as HTMLElement;
    const leftLimit = halfwayX - draggableInner.offsetWidth;
    const rightLimit = halfwayX;

    let targetX = currentX;
    if (currentX > rightLimit) targetX = rightLimit - 6;
    if (currentX < leftLimit) targetX = leftLimit + 6;

    animate(
      ".scale",
      { x: targetX },
      { type: "spring", stiffness: 110, damping: 12, duration: 0.2 }
    );
  }, [animate, currentX]);

  useEffect(() => {
    const scrollContainer = document.querySelector(
      ".scroll-container"
    ) as HTMLElement;
    addMouseListeners(scrollContainer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="scroll-container-root">
      <div className="triangle" />
      <div className="scroll-container">
        <div className="draggable">
          <div className="draggable-inner" ref={scope}>
            <motion.div className="scale">
              {items.map((item, index) => (
                <div
                  key={index}
                  className={`scale-item ${
                    index % 5 === 0 ? "main-value" : ""
                  }`}
                >
                  {item}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepScroller;
