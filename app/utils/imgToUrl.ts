export const imageToUrl = (image: any) => {
  if (!image) return "";
  if (image && typeof image !== "string") {
    return URL.createObjectURL(image);
  } else if (image && typeof image === "string") {
    return image;
  }
  return "";
};
