interface UploadProgressProps {
  progress: number;
  isUploading: boolean;
}

export default function UploadProgress({ progress, isUploading }: UploadProgressProps) {
  if (!isUploading) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-[Cairo] text-[#697282]">
        <span>جاري الرفع...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00549A] to-[#0070c0] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
