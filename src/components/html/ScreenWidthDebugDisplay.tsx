import { useEffect, useState } from "react";
import useAppStore from "../../stores/useAppStore";

function getBreakpoint(width: number) {
  if (width < 640) {
    return "mobile";
  } else if (width < 768) {
    return "sm";
  } else if (width < 1024) {
    return "md";
  } else if (width < 1280) {
    return "lg";
  } else if (width < 1536) {
    return "xl";
  } else {
    return "2xl";
  }
}

export default function ScreenWidthDebugDisplay() {
  const debug = useAppStore.getState().debug;
  const [info, setInfo] = useState({
    width: window.innerWidth,
    breakpoint: getBreakpoint(window.innerWidth),
  });

  function handleResize() {
    setInfo({
      width: window.innerWidth,
      breakpoint: getBreakpoint(window.innerWidth),
    });
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {debug && (
        <div className="absolute right-0 bottom-0 z-50 flex flex-col rounded-tl-sm bg-black/50 p-2 text-right text-xs text-red-500 sm:text-orange-500 md:text-yellow-500 lg:text-green-500 xl:text-blue-500 2xl:text-purple-500">
          <div className="flex w-full">{info.breakpoint}</div>
          <div className="flex w-full">{info.width}px</div>
        </div>
      )}
    </>
  );
}
