import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../pages/App/App';
import MainShell from './PageShell/MainShell';
import ComposerShell from './PageShell/ComposerShell';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <MainShell /> },
        { path: 'dashboard', element: <MainShell /> },
        { path: 'composer', element: <ComposerShell /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
