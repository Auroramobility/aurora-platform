import Image from "next/image";

type Props = {
  image?: string;
  name: string;
};

export function VehicleGallery({ image, name }: Props) {
  if (!image) {
    return (
      <div className="flex h-[520px] items-center justify-center rounded-3xl border bg-muted text-muted-foreground">
        No image available
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border bg-muted">
      <Image
        src={image || "/images/car-placeholder.jpg"}
        alt={name}
        width={1400}
        height={900}
        priority
        className="h-[520px] w-full object-cover transition duration-500 hover:scale-105"
      />
    </div>
  );
}