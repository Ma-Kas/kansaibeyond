import { useLayoutEffect, useState } from 'react';

type WindowResizeProps = {
  mainContentHeaderElement: HTMLDivElement | null;
  mainContentBodyElement: HTMLDivElement | null;
};

// Calculate the top of the sticky card header based on content_header height
// and margin-top of body passed as ref
// Used on rerender through useLayoutEffect, and on window resize event
const useCardHeaderTopPosition = ({
  mainContentHeaderElement,
  mainContentBodyElement,
}: WindowResizeProps) => {
  const [headerTopStyle, setHeaderTopStyle] = useState('');
  useLayoutEffect(() => {
    if (mainContentHeaderElement && mainContentBodyElement) {
      const updateTopStyle = () => {
        const contentHeaderHeight = window.getComputedStyle(
          mainContentHeaderElement
        ).height;
        const contentBodyMarginTop = window.getComputedStyle(
          mainContentBodyElement
        ).marginTop;

        const top = `${
          Number(contentHeaderHeight.slice(0, -2)) +
          Number(contentBodyMarginTop.slice(0, -2))
        }px`;
        setHeaderTopStyle(top);
      };

      window.addEventListener('resize', updateTopStyle);
      updateTopStyle();
      return () => window.removeEventListener('resize', updateTopStyle);
    }
    return;
  }, [mainContentHeaderElement, mainContentBodyElement]);
  return headerTopStyle;
};

export default useCardHeaderTopPosition;
