const formatStringToCamelCase = (str: string) => {
  const splitString = str.split('-');
  if (splitString.length === 1) return splitString[0];
  return (
    splitString[0] +
    splitString
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join('')
  );
};

// Takes an inline style string, parses it into key/value pair
// Usable with react's style property
export const parseInlineStyle = (inlineString: string) => {
  const style: Record<string, string> = {};
  inlineString.split(';').forEach((el) => {
    const [property, value] = el.split(':');
    if (!property) return;

    const formattedProperty = formatStringToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });

  return style;
};

export default parseInlineStyle;
