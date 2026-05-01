interface ImageValidationProps {
  error: string | undefined;
  className?: string;
}

export default function ImageValidation({ error, className = '' }: ImageValidationProps) {
  if (!error) return null;

  return (
    <div className={`p-3 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm font-[Cairo] ${className}`}>
      <p className="font-bold">خطأ</p>
      <p className="text-red-600 text-xs mt-1">{error}</p>
    </div>
  );
}
