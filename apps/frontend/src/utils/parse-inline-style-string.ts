const parseInlineStyle = (style: string) => {
  // Takes an inline style string, parses it into key/value pair
  // Usable with react's style property
  const template = document.createElement('template');
  template.setAttribute('style', style);
  return Object.entries(template.style)
    .filter(([key]) => !/^[0-9]+$/.test(key))
    .filter(([, value]) => Boolean(value))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
};

export default parseInlineStyle;
