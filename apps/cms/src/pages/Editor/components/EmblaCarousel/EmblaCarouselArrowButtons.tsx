import React, { PropsWithChildren } from 'react';

type PropType = PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>;

const PrevButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className='editor_embla_button editor_embla_button--prev'
      type='button'
      {...restProps}
    >
      <svg className='editor_embla_button__svg' viewBox='0 0 23 39'>
        <path
          fill='currentColor'
          transform='translate(-855, -230)'
          d='M857.005,231.479L858.5,230l18.124,18-18.127,18-1.49-1.48L873.638,248Z'
        />
      </svg>
      {children}
    </button>
  );
};

const NextButton: React.FC<PropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className='editor_embla_button editor_embla_button--next'
      type='button'
      {...restProps}
    >
      <svg className='editor_embla_button__svg' viewBox='0 0 23 39'>
        <path
          transform='translate(-855, -230)'
          d='M857.005,231.479L858.5,230l18.124,18-18.127,18-1.49-1.48L873.638,248Z'
        />
      </svg>
      {children}
    </button>
  );
};

export { PrevButton, NextButton };
