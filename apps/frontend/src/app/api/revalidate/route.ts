import { type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import {
  CMS_BASE_URL,
  REVALIDATION_SECRET,
  REVALIDATION_TAGS,
} from '@/config/constants';
import { revalidateTagSchema } from '@/types/request-schemas';

const validateData = (input: unknown) => {
  const result = revalidateTagSchema.safeParse(input);
  if (!result.success) {
    throw new Error('Revalidation Error');
  } else if (result.data.secret !== REVALIDATION_SECRET) {
    throw new Error('Unauthorized');
  } else if (!Object.values(REVALIDATION_TAGS).includes(result.data.tag)) {
    throw new Error('Invalid tag');
  } else {
    return result.data;
  }
};

export const OPTIONS = () => {
  // CORS headers for preflight request
  const resHeaders = new Headers({
    'Access-Control-Allow-Origin': CMS_BASE_URL,
    'Access-Control-Allow-Methods': 'OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  });

  return new Response(null, {
    status: 204,
    headers: resHeaders,
  });
};

export const POST = async (request: NextRequest) => {
  const sessionId = request.cookies.get('sessionId');
  if (!sessionId) {
    throw new Error('Unauthorized');
  }

  const data: unknown = await request.json();
  const validatedData = validateData(data);
  revalidateTag(validatedData.tag);

  // CORS headers for POST request
  const resHeaders = new Headers({
    'Access-Control-Allow-Origin': CMS_BASE_URL,
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Credentials': 'true',
  });

  return new Response(
    JSON.stringify({ revalidated: validatedData.tag, now: new Date() }),
    { status: 200, headers: resHeaders }
  );
};
