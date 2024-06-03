import { useLayoutEffect, useState } from 'react';

type WindowResizeProps = {
  mainContentHeaderElement: HTMLDivElement | null;
};

// Calculate the top of the sticky card header based on content_header height
// and margin-top of body passed as ref
// Used on rerender through useLayoutEffect, and on window resize event
const useCardHeaderTopPosition = ({
  mainContentHeaderElement,
}: WindowResizeProps) => {
  const [headerTopStyle, setHeaderTopStyle] = useState('');

  useLayoutEffect(() => {
    if (mainContentHeaderElement) {
      const updateTopStyle = () => {
        // +1 to account for card border
        const top = mainContentHeaderElement.clientHeight + 1;
        setHeaderTopStyle(`${top}px`);
      };

      window.addEventListener('resize', updateTopStyle);
      updateTopStyle();
      return () => window.removeEventListener('resize', updateTopStyle);
    }
    return;
  }, [mainContentHeaderElement]);
  return headerTopStyle;
};

export default useCardHeaderTopPosition;
