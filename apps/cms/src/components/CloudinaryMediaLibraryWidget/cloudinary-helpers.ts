const cloudinaryWidgetUrl =
  'https://console.cloudinary.com/console/media_library/';

const destroyWidgets = () => {
  // Get all instances of created widget divs
  const widgets = document.querySelectorAll(
    `div:has(iframe[src^="${cloudinaryWidgetUrl}"])`
  );
  widgets.forEach((node) => node.remove());
};

export { destroyWidgets };
