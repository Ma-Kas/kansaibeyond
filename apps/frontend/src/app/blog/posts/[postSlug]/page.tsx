import type { Metadata } from 'next';
import { getOnePost, getPostSlugList } from '@/lib/requests/postRequests';
import BlogPostView from '@/components/BlogPostView/BlogPostView';
import {
  CLOUDINARY_BASE_URL,
  KANSAIBEYOND_TWITTER_HANDLE,
  METADATA_IMAGE_TRANSFORM,
  SITENAME,
  WSRV_BASE_URL,
} from '@/config/constants';

export const generateStaticParams = async () => {
  const postSlugs = await getPostSlugList();
  return postSlugs;
};

export const generateMetadata = async ({
  params,
}: {
  params: { postSlug: string };
}): Promise<Metadata> => {
  const post = await getOnePost(params.postSlug);

  return {
    title: post.title,
    description:
      'Read through the newest blog post, brought to you by Kansai & Beyond.',
    twitter: {
      site: KANSAIBEYOND_TWITTER_HANDLE,
      card: 'summary_large_image',
      title: post.title,
      description:
        'Read through the newest blog post, brought to you by Kansai & Beyond.',
      creator: KANSAIBEYOND_TWITTER_HANDLE,
      images: [
        {
          url: new URL(
            `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${METADATA_IMAGE_TRANSFORM}${post.coverImage?.urlSlug}&output=jpg`
          ),
          alt: post.coverImage?.altText || '',
        },
      ],
    },
    openGraph: {
      url: './',
      siteName: SITENAME,
      type: 'website',
      title: post.title,
      description:
        'Read through the newest blog post, brought to you by Kansai & Beyond.',
      images: [
        {
          url: new URL(
            `${WSRV_BASE_URL}${CLOUDINARY_BASE_URL}${METADATA_IMAGE_TRANSFORM}${post.coverImage?.urlSlug}&output=jpg`
          ),
          alt: post.coverImage?.altText || '',
        },
      ],
    },
  };
};

const PostPage = async ({
  params: { postSlug },
}: {
  params: { postSlug: string };
}) => {
  const post = await getOnePost(postSlug);

  return (
    <>
      <BlogPostView postData={post} />
    </>
  );
};

export default PostPage;
