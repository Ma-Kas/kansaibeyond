import { z } from 'zod';

// prettier-ignore
const reelDataSchema = z.object(
  {
    id: z.number(),
    url: z.string().min(1, { message: 'Url cannot be empty.' }),
    image: z.object(
      {
        urlSlug: z.string().min(1, { message: 'Please select an image' }),
        altText: z.string().min(1, { message: 'Image alternative text cannot be empty.' }),
      }  
    ).strict(),
  }
).strict();

// prettier-ignore
export const socialMediaReelSchema = z.object(
    {
      reelData: z.array(reelDataSchema)
    }
).strict();

export type ReelData = z.infer<typeof reelDataSchema>;
export type SocialMediaReel = z.infer<typeof socialMediaReelSchema>;
