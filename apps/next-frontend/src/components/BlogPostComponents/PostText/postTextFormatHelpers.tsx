import parseInlineStyle from '@/utils/parse-inline-style-string';
import {
  TEXT_FORMAT_STATES,
  TEXT_FORMAT_ENUM,
} from '@/utils/post-content-constants';

import classes from './PostText.module.css';

// Transforms byte shifted format number into array of all applicable text formats
// (bold, italic etc) or null if no additional format styles are applied to text
export const getTextFormatStates = (format: number) => {
  if (!format) {
    return null;
  }

  return Object.keys(
    Object.entries(TEXT_FORMAT_STATES).reduce(
      (acc, [key, value]) => (value & format ? { ...acc, [key]: true } : acc),
      {}
    )
  );
};

// for each entry in the formats array, append the appropriate class to the base className string
const handleAdditionalTextFormatClasses = (
  baseClass: string,
  formats: string[]
) => {
  if (!formats.length) {
    return baseClass;
  }

  let classNames = baseClass;

  if (formats.includes(TEXT_FORMAT_ENUM.IS_BOLD)) {
    classNames += ' ' + classes['post_text_bold'];
  }
  if (formats.includes(TEXT_FORMAT_ENUM.IS_ITALIC)) {
    classNames += ' ' + classes['post_text_italic'];
  }
  if (formats.includes(TEXT_FORMAT_ENUM.IS_STRIKETHROUGH)) {
    classNames += ' ' + classes['post_text_strikethrough'];
  }
  if (formats.includes(TEXT_FORMAT_ENUM.IS_UNDERLINE)) {
    classNames += ' ' + classes['post_text_underline'];
  }
  if (formats.includes(TEXT_FORMAT_ENUM.IS_CODE)) {
    classNames += ' ' + classes['post_text_code'];
  }

  return classNames;
};

const handleInnerTextFormatTag = (
  style: string,
  text: string,
  formats: string[]
) => {
  const formatsArray = [...formats];

  const boldIndex = formatsArray.indexOf(TEXT_FORMAT_ENUM.IS_BOLD);
  if (boldIndex !== -1) {
    formatsArray.splice(boldIndex, 1);

    const className = handleAdditionalTextFormatClasses(
      classes['post_text_bold'],
      formatsArray
    );

    return (
      <strong
        className={className}
        {...(style && { style: parseInlineStyle(style) })}
      >
        {text}
      </strong>
    );
  }

  const italicIndex = formatsArray.indexOf(TEXT_FORMAT_ENUM.IS_ITALIC);
  if (italicIndex !== -1) {
    formatsArray.splice(italicIndex, 1);

    const className = handleAdditionalTextFormatClasses(
      classes['post_text_italic'],
      formatsArray
    );
    return (
      <em
        className={className}
        {...(style && { style: parseInlineStyle(style) })}
      >
        {text}
      </em>
    );
  }
  const className = handleAdditionalTextFormatClasses('', formatsArray);
  return (
    <span
      className={className}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {text}
    </span>
  );
};

// Working from out to in, construct the proper outer tag based on text formatting
// Then call function to pick inner tag (if applicable)
// Lastly assign extra css classes for any additional text formatting not covered
// by html tags
export const constructTextComponentFromFormat = (
  className: string,
  style: string,
  text: string,
  formats: string[] | null
) => {
  // render basic component if formats=null or formats array empty
  if (!formats || !formats.length) {
    return (
      <span
        className={className}
        {...(style && { style: parseInlineStyle(style) })}
      >
        {text}
      </span>
    );
  }

  // Copy of formats array to manipulate
  const formatsArray = [...formats];

  const codeIndex = formatsArray.indexOf(TEXT_FORMAT_ENUM.IS_CODE);
  if (codeIndex !== -1) {
    formatsArray.splice(codeIndex, 1);

    return (
      <code
        className={`${className} ${classes['post_text_code']}`}
        {...(style && { style: parseInlineStyle(style) })}
      >
        {formatsArray.length ? (
          handleInnerTextFormatTag(style, text, formatsArray)
        ) : (
          <>{text}</>
        )}
      </code>
    );
  }

  const superscriptIndex = formatsArray.indexOf(
    TEXT_FORMAT_ENUM.IS_SUPERSCRIPT
  );
  if (superscriptIndex !== -1) {
    formatsArray.splice(superscriptIndex, 1);

    return (
      <sup
        className={className}
        {...(style && { style: parseInlineStyle(style) })}
      >
        {formatsArray.length ? (
          handleInnerTextFormatTag(style, text, formatsArray)
        ) : (
          <>{text}</>
        )}
      </sup>
    );
  }

  const subscriptIndex = formatsArray.indexOf(TEXT_FORMAT_ENUM.IS_SUBSCRIPT);
  if (subscriptIndex !== -1) {
    formatsArray.splice(subscriptIndex, 1);

    return (
      <sub
        className={className}
        {...(style && { style: parseInlineStyle(style) })}
      >
        {formatsArray.length ? (
          handleInnerTextFormatTag(style, text, formatsArray)
        ) : (
          <>{text}</>
        )}
      </sub>
    );
  }

  return (
    <span
      className={className}
      {...(style && { style: parseInlineStyle(style) })}
    >
      {formatsArray.length ? (
        handleInnerTextFormatTag(style, text, formatsArray)
      ) : (
        <>{text}</>
      )}
    </span>
  );
};
