export function classMerge(...inputs: string[]) {
  return inputs.join(" ");
}

export function getImageNameWithoutExtension(url: string) {
  const filename = url.substring(url.lastIndexOf("/") + 1);
  const extension = filename.substring(filename.lastIndexOf("."));
  return filename.split(extension)[0];
}
