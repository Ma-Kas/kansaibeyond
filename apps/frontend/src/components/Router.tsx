import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Route Imports
import App from '../pages/App/App';
import NotFoundPage from '../pages/ErrorPages/NotFoundPage';

// Sub-Route Imports
import BlogPostView from '../pages/BlogPostView/BlogPostView';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <NotFoundPage /> },
        {
          path: '*',
          element: <NotFoundPage />,
        },
        {
          path: 'blog/posts/:postSlug',
          element: <BlogPostView />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
