import type { ReactNode } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  trendPercent: number;
  helperText?: string;
  icon?: ReactNode;
}

export function StatCard({
  title,
  value,
  trendPercent,
  helperText,
  icon,
}: StatCardProps) {
  const isPositive = trendPercent >= 0;

  return (
    <Card className="h-full border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        {icon ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm text-primary">
            {icon}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              {value}
            </span>
            {helperText ? (
              <span className="mt-1 text-xs text-slate-500">{helperText}</span>
            ) : null}
          </div>
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            <span>{Math.abs(trendPercent).toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

