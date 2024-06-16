import React, { PropsWithChildren } from 'react';
import classes from './EmblaCarousel.module.css';

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
      className={`${classes['embla_button']} ${classes['embla_button_prev']}`}
      type='button'
      {...restProps}
    >
      <svg className={classes['embla_button_svg']} viewBox='0 0 23 39'>
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
      className={`${classes['embla_button']} ${classes['embla_button_next']}`}
      type='button'
      {...restProps}
    >
      <svg className={classes['embla_button_svg']} viewBox='0 0 23 39'>
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
