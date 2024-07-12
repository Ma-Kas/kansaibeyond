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

export { futuraLtLight, futuraLtBook, ivyMode, handwriting };
