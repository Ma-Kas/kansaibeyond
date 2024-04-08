import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Route Imports
import App from '../pages/App/App';
import MainShell from './PageShell/MainShell';
import ComposerShell from './PageShell/ComposerShell';

// Sub-Route Imports
import BlogPosts from '../pages/BlogPosts/BlogPosts';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <MainShell /> },
        {
          path: 'dashboard',
          element: <MainShell />,
          children: [
            {
              path: 'blog/posts',
              element: <BlogPosts />,
            },
          ],
        },
        { path: 'composer', element: <ComposerShell /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
