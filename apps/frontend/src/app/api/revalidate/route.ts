import { type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';
import { REVALIDATION_SECRET } from '@/config/constants';

// prettier-ignore
const revalidateTagSchema = z.object(
  {
    tag: z.string(),
    secret: z.string(),
  }
).strict();

const validateData = (input: unknown) => {
  const result = revalidateTagSchema.safeParse(input);
  if (!result.success) {
    throw new Error('Revalidation Error');
  } else if (result.data.secret !== REVALIDATION_SECRET) {
    throw new Error('Unauthorized');
  } else {
    return result.data;
  }
};

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId');
  if (!sessionId) {
    throw new Error('Unauthorized');
  }

  const data: unknown = await request.json();
  const validatedData = validateData(data);
  revalidateTag(validatedData.tag);

  return Response.json({ revalidated: validatedData.tag, now: Date.now() });
}
