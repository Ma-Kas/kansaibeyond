import { createFormContext } from '@mantine/form';

type ReelData = {
  id: number;
  url: string;
  image: {
    urlSlug: string;
    altText: string;
  };
};

type SocialMediaReelFormValues = {
  reelData: ReelData[];
};

export const [
  SocialMediaReelFormProvider,
  useSocialMediaReelFormContext,
  useSocialMediaReelForm,
] = createFormContext<SocialMediaReelFormValues>();
