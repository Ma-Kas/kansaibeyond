import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Route Imports
import App from '../pages/App/App';
import MainShell from './PageShell/MainShell';
import ComposerShell from './PageShell/ComposerShell';

// Sub-Route Imports
import BlogPosts from '../pages/BlogPosts/BlogPosts';
import BlogCategories from '../pages/BlogCategories/BlogCategories';
import BlogTags from '../pages/BlogTags/BlogTags';

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
            {
              path: 'blog/categories',
              element: <BlogCategories />,
            },
            {
              path: 'blog/tags',
              element: <BlogTags />,
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
