import type { MetadataRoute } from 'next';
import { FRONTEND_BASE_URL } from '@/config/constants';
import { getAllPosts } from '@/lib/requests/postRequests';
import { getAllCategoriesList } from '@/lib/requests/categoryRequests';
import { getAllTags } from '@/lib/requests/tagRequests';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [posts, categories, tags] = await Promise.all([
    getAllPosts(),
    getAllCategoriesList(),
    getAllTags(),
  ]);

  return [
    {
      url: FRONTEND_BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${FRONTEND_BASE_URL}/about`,
      lastModified: new Date(),
    },
    {
      url: `${FRONTEND_BASE_URL}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${FRONTEND_BASE_URL}/blog/posts`,
      lastModified: new Date(),
    },
    ...posts.rows.map((post) => ({
      url: `${FRONTEND_BASE_URL}/blog/posts/${post.postSlug}`,
      lastModified: new Date(post.updatedAt),
    })),
    {
      url: `${FRONTEND_BASE_URL}/blog/categories`,
      lastModified: new Date(),
    },
    ...categories.map((category) => ({
      url: `${FRONTEND_BASE_URL}/blog/categories/${category.categorySlug}`,
      lastModified: new Date(),
    })),
    ...tags.map((tag) => ({
      url: `${FRONTEND_BASE_URL}/blog/tags/${tag.tagSlug}`,
      lastModified: new Date(),
    })),
    {
      url: `${FRONTEND_BASE_URL}/japan-sites`,
      lastModified: new Date(),
    },
    {
      url: `${FRONTEND_BASE_URL}/taste-of-hong-kong`,
      lastModified: new Date(),
    },
    {
      url: `${FRONTEND_BASE_URL}/search`,
      lastModified: new Date(),
    },
    {
      url: `${FRONTEND_BASE_URL}/privacy-policy`,
      lastModified: new Date(),
    },
  ];
};

export default sitemap;
