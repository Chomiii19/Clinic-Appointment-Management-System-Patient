export function truncateFilename(filename: string, maxLength: number = 6) {
  if (!filename) return "";
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex === -1 || filename.length <= maxLength) return filename;

  const name = filename.substring(0, maxLength);
  const extension = filename.substring(dotIndex);
  return `${name}...${extension}`;
}
