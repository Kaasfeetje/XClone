import React, { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(
  ref: React.Ref<HTMLDivElement>,
  onOutsideClick: () => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
        // alert("You clicked outside of me!");
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
type Props = { children: React.ReactNode; onOutsideClick: () => void };
export default function OutsideAlerter({ children, onOutsideClick }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, onOutsideClick);

  return <div ref={wrapperRef}>{children}</div>;
}
