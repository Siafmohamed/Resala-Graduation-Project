import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '../../../shared/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "لم يتم العثور على نتائج",
  description = "جرب تغيير فلاتر البحث أو الكلمات المفتاحية للحصول على نتائج أفضل.",
  onReset,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-6 text-gray-300">
        <SearchX size={40} />
      </div>
      <h3 className="text-xl font-bold text-[#101727] font-[Cairo] mb-2">{title}</h3>
      <p className="text-sm text-[#697282] font-[Cairo] max-w-xs mb-8 leading-relaxed">
        {description}
      </p>
      {onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-xl font-bold font-[Cairo] border-primary text-primary hover:bg-primary/5 gap-2"
        >
          <RotateCcw size={16} />
          إعادة ضبط الفلاتر
        </Button>
      )}
    </div>
  );
};
