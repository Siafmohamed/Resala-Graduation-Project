interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ImageCropper(_props: ImageCropperProps) {
  // Placeholder - implement with react-easy-crop or similar library when needed
  return (
    <div className="p-4 text-center text-sm text-[#697282] font-[Cairo]">
      <p>Image cropping functionality - to be implemented with cropping library</p>
    </div>
  );
}
