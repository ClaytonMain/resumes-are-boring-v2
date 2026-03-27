import { useLayoutEffect, useMemo, useState } from "react";
import { Vector2 } from "three";

export default function useMousePosition() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const mousePosition = useMemo(() => new Vector2(0, 0), []);
  useLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.set(
        (event.clientX / windowSize.width) * 2 - 1,
        (event.clientY / windowSize.height) * -2 + 1,
      );
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [windowSize.width, windowSize.height, mousePosition]);

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return mousePosition;
}
