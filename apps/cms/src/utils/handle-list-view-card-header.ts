// Calculate the top of the sticky card header based on content_header height
// and margin-top of body passed as ref
// Used on rerender through useLayoutEffect, and on window resize event
const handleCardHeaderPosition = (
  mainContentHeaderElement: HTMLDivElement,
  mainContentBodyElement: HTMLDivElement,
  setHeaderTopStyle: React.Dispatch<React.SetStateAction<string>>
) => {
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

export default handleCardHeaderPosition;
