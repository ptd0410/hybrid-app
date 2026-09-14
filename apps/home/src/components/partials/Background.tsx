import { Image } from "../ui";

export type BackgroundProps = {};

export function Background({}: BackgroundProps) {
  return (
    <Image
      className="absolute inset-0"
      src="https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg"
    />
  );
}
