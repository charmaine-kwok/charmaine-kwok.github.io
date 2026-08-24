import { generateOgImageForSite } from "@utils/generateOgImages";

export const GET = async () => {
  const buffer = await generateOgImageForSite();

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
