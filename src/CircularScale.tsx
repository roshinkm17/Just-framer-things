import { useEffect, useState } from "react";
import "./App.css";
import { useSwipeable } from "react-swipeable";
import { useAnimate } from "framer-motion";
import "./CircularScale.css";

const OPTIONS = {
  SPACING: 1,
  SIZE: 3,
};

function CircularScale() {
  const [scope, animate] = useAnimate();
  const [currentChar, setCurrentChar] = useState(0);

  const onUpdate = () => {
    const supportsTrigFunctions = window.CSS.supports("(--a: calc(1px + 1px))");
    const text = Array.from({ length: 10 }, (_, i) => i + 1);
    const heading = document.querySelector("h1") as HTMLElement;

    heading.innerHTML =
      text
        .map(
          (char, i) =>
            `<span aria-hidden="true" class="char" style="--char-index: ${i};">${char}</span>`
        )
        .join("") + `<span class="sr-only">${text.join("")}</span>`;

    heading.style.setProperty("--char-count", text.length.toString());
    heading.style.setProperty("--font-size", OPTIONS.SIZE.toString());
    heading.style.setProperty("--character-width", OPTIONS.SPACING.toString());
    heading.style.setProperty(
      "--radius",
      supportsTrigFunctions
        ? "calc((var(--character-width) / sin(var(--inner-angle))) * -2ch"
        : `calc((${OPTIONS.SPACING} / ${Math.sin(
            360 / text.length / (180 / Math.PI)
          )}) * -1ch)`
    );
  };

  const animateText = (direction: string) => {
    setCurrentChar((prev) =>
      direction === "Right"
        ? prev === 0
          ? 9
          : prev - 1
        : prev === 9
        ? 0
        : prev + 1
    );

    const newRotation =
      -currentChar * (360 / 10) + (direction === "Left" ? -40 : 40);
    animate(
      ".text-ring",
      { rotate: newRotation },
      { type: "spring", stiffness: 110, damping: 12, duration: 0.2 }
    );
  };

  useEffect(() => {
    onUpdate();
  }, []);

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (eventData.dir === "Left" || eventData.dir === "Right") {
        animateText(eventData.dir);
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <section>
      <div className="clip-window" {...handlers} ref={scope}>
        <h1 className="text-ring"></h1>
      </div>
    </section>
  );
}

export default CircularScale;
