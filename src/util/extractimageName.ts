import url from "url";
export const extracImageName = (imageSource: string): string => {
  const parsedUrl = url.parse(imageSource);
  const path = parsedUrl.pathname?.slice(1);
  return path!;
};
