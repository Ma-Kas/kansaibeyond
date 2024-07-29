import localFont from 'next/font/local';

const futuraLtLight = localFont({
  src: '../../public/fonts/FuturaLT-Light.ttf',
  weight: '300',
  style: 'normal',
  variable: '--font-family-light',
});

const futuraLtBook = localFont({
  src: '../../public/fonts/FuturaLT-Book.ttf',
  weight: '300',
  style: 'normal',
  variable: '--font-family-book',
});

const geistRegular = localFont({
  src: '../../public/fonts/Geist-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-family-geist-regular',
});

const geistLight = localFont({
  src: '../../public/fonts/Geist-Light.ttf',
  weight: '300',
  style: 'normal',
  variable: '--font-family-geist-light',
});

const latoRegular = localFont({
  src: '../../public/fonts/Lato-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-family-lato-regular',
});

const madefor = localFont({
  src: '../../public/fonts/Madefor.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-family-madefor',
});

const latoLight = localFont({
  src: '../../public/fonts/Lato-Light.ttf',
  weight: '300',
  style: 'normal',
  variable: '--font-family-lato-light',
});

const robotoRegular = localFont({
  src: '../../public/fonts/Roboto-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-family-roboto-regular',
});

const robotoLight = localFont({
  src: '../../public/fonts/Roboto-Light.ttf',
  weight: '300',
  style: 'normal',
  variable: '--font-family-roboto-light',
});

const ivyMode = localFont({
  src: '../../public/fonts/ivy-mode-thin.ttf',
  weight: '100',
  style: 'normal',
  variable: '--font-family-ivy-mode',
});

const handwriting = localFont({
  src: '../../public/fonts/SebastianBobby.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-family-handwriting',
});

export {
  futuraLtLight,
  futuraLtBook,
  geistRegular,
  geistLight,
  latoRegular,
  latoLight,
  madefor,
  robotoRegular,
  robotoLight,
  ivyMode,
  handwriting,
};
