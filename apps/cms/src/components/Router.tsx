import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Route Imports
import App from '../pages/App/App';
import MainShell from './PageShell/MainShell';
import ComposerShell from './PageShell/ComposerShell';
import NotFoundPage from '../pages/ErrorPages/NotFoundPage';

// Sub-Route Imports
import BlogPosts from '../pages/BlogPosts/BlogPosts';
import BlogCategories from '../pages/BlogCategories/BlogCategories';
import NewBlogCategory from '../pages/NewUpdateBlogCategory/NewBlogCategory';
import BlogTags from '../pages/BlogTags/BlogTags';
import NewBlogTag from '../pages/NewUpdateBlogTag/NewBlogTag';
import UpdateBlogTag from '../pages/NewUpdateBlogTag/UpdateBlogTag';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <MainShell /> },
        {
          path: '*',
          element: <NotFoundPage />,
        },
        {
          path: 'dashboard',
          element: <MainShell />,
          children: [
            {
              path: '*',
              element: <NotFoundPage />,
            },
            {
              path: 'blog/posts',
              element: <BlogPosts />,
            },
            {
              path: 'blog/categories',
              element: <BlogCategories />,
            },
            {
              path: 'blog/categories/create-category',
              element: <NewBlogCategory />,
            },
            {
              path: 'blog/tags',
              element: <BlogTags />,
            },
            {
              path: 'blog/tags/create-tag',
              element: <NewBlogTag />,
            },
            {
              path: 'blog/tags/:tagSlug/edit',
              element: <UpdateBlogTag />,
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
