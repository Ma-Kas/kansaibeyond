import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

// General Imports
import { authLoader } from '../utils/auth-loader';
import AuthProvider from '../context/AuthContext';
import HeaderMain from './HeaderMain/HeaderMain';

// Route Imports
import App from '../pages/App/App';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import MainShell from './PageShell/MainShell';
import ComposerShell from './PageShell/ComposerShell';
import AdminRoute from './AdminRoute/AdminRoute';
import RestrictedRoute from './RestrictedRoute/RestrictedRoute';

import NotFoundPage from '../pages/ErrorPages/NotFoundPage';
import DisabledErrorPage from '../pages/ErrorPages/DisabledErrorPage';

// Sub-Route Imports
import BlogPosts from '../pages/BlogPosts/BlogPosts';
import BlogCategories from '../pages/BlogCategories/BlogCategories';
import NewBlogCategory from '../pages/NewUpdateBlogCategory/NewBlogCategory';
import UpdateBlogCategory from '../pages/NewUpdateBlogCategory/UpdateBlogCategory';
import BlogTags from '../pages/BlogTags/BlogTags';
import NewBlogTag from '../pages/NewUpdateBlogTag/NewBlogTag';
import UpdateBlogTag from '../pages/NewUpdateBlogTag/UpdateBlogTag';
import Users from '../pages/Users/Users';
import UpdateUser from '../pages/UpdateUser/UpdateUser';
import AffiliateBlogs from '../pages/AffiliateBlogs/AffiliateBlogs';
import NewAffiliateBlog from '../pages/NewUpdateAffiliateBlog/NewAffiliateBlog';
import UpdateAffiliateBlog from '../pages/NewUpdateAffiliateBlog/UpdateAffiliateBlog';
import UpdateSocialMediaReel from '../pages/UpdateSocialMediaReel/UpdateSocialMediaReel';

const Router = () => {
  const queryClient = useQueryClient();
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <AuthProvider>
          <App />
        </AuthProvider>
      ),
      loader: authLoader(queryClient),
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
              element: (
                <AdminRoute>
                  <NewBlogCategory />
                </AdminRoute>
              ),
            },
            {
              path: 'blog/categories/:categorySlug/edit',
              element: (
                <AdminRoute>
                  <UpdateBlogCategory />
                </AdminRoute>
              ),
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
            {
              path: 'users',
              element: (
                <AdminRoute>
                  <Users />
                </AdminRoute>
              ),
            },
            {
              path: 'users/:username/edit',
              element: (
                <RestrictedRoute>
                  <UpdateUser />
                </RestrictedRoute>
              ),
            },
            {
              path: 'affiliates',
              element: (
                <AdminRoute>
                  <AffiliateBlogs />
                </AdminRoute>
              ),
            },
            {
              path: 'affiliates/create-affiliate',
              element: (
                <AdminRoute>
                  <NewAffiliateBlog />
                </AdminRoute>
              ),
            },
            {
              path: 'affiliates/:id/edit',
              element: (
                <AdminRoute>
                  <UpdateAffiliateBlog />
                </AdminRoute>
              ),
            },
            {
              path: 'social-media-reel/edit',
              element: (
                <AdminRoute>
                  <UpdateSocialMediaReel />
                </AdminRoute>
              ),
            },
          ],
        },
        { path: 'composer/edit/:postSlug', element: <ComposerShell /> },
      ],
    },
    {
      path: '/login',
      element: (
        <AuthProvider>
          <LoginPage /> <HeaderMain authorized={false} />
        </AuthProvider>
      ),
    },
    {
      path: '/signup',
      element: (
        <>
          <SignUpPage /> <HeaderMain authorized={false} />
        </>
      ),
    },
    {
      path: '/disabled',
      element: (
        <AuthProvider>
          <DisabledErrorPage />
          <HeaderMain authorized={false} />
        </AuthProvider>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
