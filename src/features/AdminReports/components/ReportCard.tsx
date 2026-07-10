import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import {
  useReport
} from '../hooks/useDonors';
import type { ReportConfig } from '../config/reportsConfig';
import { exportToExcel } from '@/shared/utils/exportToExcel';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const COLORS = ['#0056B3', '#fca5a5', '#93c5fd', '#ef4444', '#22c55e'];

const flattenObject = (obj: any, prefix = ''): any => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else if (Array.isArray(obj[k])) {
      obj[k].forEach((item: any, index: number) => {
        Object.assign(acc, flattenObject(item, `${pre}${k}[${index}]`));
      });
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as any);
};

const prepareExportData = (data: any): any[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  const arrayProps = Object.keys(data).filter((k) => Array.isArray(data[k]));
  if (arrayProps.length > 0) {
    return data[arrayProps[0]];
  }
  return [flattenObject(data)];
};

const getSummaryStats = (data: any): { label: string; value: string | number }[] => {
  if (!data) return [];
  const stats: { label: string; value: string | number }[] = [];

  if (typeof data === 'object' && !Array.isArray(data)) {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'number') {
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase());
        stats.push({ label, value: data[key] });
      } else if (Array.isArray(data[key])) {
        stats.push({ label: `${key} Count`, value: data[key].length });
      }
    });
  }
  return stats.slice(0, 6);
};

const getChartData = (data: any): { name: string; value: number }[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        const keys = Object.keys(item);
        const nameKey =
          keys.find((k) => k.toLowerCase().includes('name')) ||
          keys.find((k) => k.toLowerCase().includes('title')) ||
          keys.find((k) => k.toLowerCase().includes('month')) ||
          keys[0];
        const valueKey =
          keys.find((k) => k.toLowerCase().includes('amount')) ||
          keys.find((k) => k.toLowerCase().includes('count')) ||
          keys.find((k) => typeof item[k] === 'number');
        if (nameKey && valueKey && item[valueKey]) {
          return {
            name: String(item[nameKey]),
            value: Number(item[valueKey]),
          };
        }
        return null;
      })
      .filter(Boolean) as { name: string; value: number }[];
  }
  const arrayProps = Object.keys(data).filter((k) => Array.isArray(data[k]));
  if (arrayProps.length > 0) {
    return getChartData(data[arrayProps[0]]);
  }
  return [];
};

const getChartType = (configId: string): 'bar' | 'line' | 'pie' => {
  if (configId.includes('monthly') || configId.includes('donations')) return 'line';
  if (configId.includes('users') || configId.includes('distribution')) return 'pie';
  return 'bar';
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm font-[Cairo]">
        <p className="text-xs text-gray-600">{payload[0].payload.name}</p>
        <p className="font-bold text-[#0056B3]">{payload[0].value.toLocaleString('ar-EG')}</p>
      </div>
    );
  }
  return null;
};

export const ReportCard = ({ config }: { config: ReportConfig }) => {
  const [period, setPeriod] = useState<number | undefined>(5); // Default to "All time" = 5
  const { data, isLoading, error } = useReport(config.apiEndpoint, config.supportsPeriodFilter ? period : undefined);

  const summaryStats = useMemo(() => getSummaryStats(data), [data]);
  const chartData = useMemo(() => getChartData(data), [data]);
  const exportData = useMemo(() => prepareExportData(data), [data]);
  const chartType = useMemo(() => getChartType(config.id), [config.id]);

  const handleExport = () => {
    if (exportData.length > 0) {
      exportToExcel(exportData, `${config.title} - ${new Date().toISOString().split('T')[0]}`);
    } else if (data) {
      exportToExcel([flattenObject(data)], `${config.title} - ${new Date().toISOString().split('T')[0]}`);
    }
  };

  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'Cairo, sans-serif' }} />
            <YAxis stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'Cairo, sans-serif' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#0056B3" strokeWidth={3} dot={{ fill: '#0056B3', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              label={({ name }) => name}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    // Default to bar chart
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'Cairo, sans-serif' }} />
          <YAxis stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'Cairo, sans-serif' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#0056B3" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="border border-gray-200 rounded-lg bg-white shadow-sm">
      <CardHeader className="pb-2 pt-4 px-5 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <CardTitle className="font-[Cairo] font-bold text-base text-[#1E293B] text-right">
            {config.title}
          </CardTitle>
          {config.description && (
            <p className="text-xs text-gray-500 font-[Cairo]">{config.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {config.supportsPeriodFilter && (
            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(Number(e.target.value))}
                className="pl-4 pr-10 py-2 rounded-lg border border-gray-200 text-sm font-[Cairo] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={1}>آخر أسبوع</option>
                <option value={2}>آخر شهر</option>
                <option value={3}>آخر 6 أشهر</option>
                <option value={4}>آخر سنة</option>
                <option value={5}>كل الأوقات</option>
              </select>
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          )}
          <Button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <FileSpreadsheet size={16} />
            <span className="font-[Cairo] text-xs">تصدير Excel</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        {isLoading ? (
          <div className="py-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#0056B3]" />
          </div>
        ) : error ? (
          <div className="py-10 text-center text-red-600 font-[Cairo]">
            خطأ في تحميل التقرير
          </div>
        ) : (
          <div className="space-y-5">
            {/* Summary Stats Grid */}
            {summaryStats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {summaryStats.map((stat, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-50 flex flex-col items-center gap-1"
                  >
                    <span className="text-lg font-bold text-[#1E293B] font-[Cairo]">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString('ar-EG') : stat.value}
                    </span>
                    <span className="text-xs text-gray-500 font-[Cairo] text-center">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Chart Preview */}
            {chartData.length > 0 && (
              <div className="h-48 border border-gray-100 rounded-lg p-3 bg-white">
                {renderChart()}
              </div>
            )}

            {summaryStats.length === 0 && chartData.length === 0 && (
              <div className="py-10 text-center text-gray-400 font-[Cairo]">
                لا توجد بيانات للعرض
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
