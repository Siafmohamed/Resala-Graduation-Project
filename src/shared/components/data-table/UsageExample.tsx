/**
 * EXAMPLE USAGE of the DataTable system
 * This shows how queries are built and how the component is integrated.
 */
import React from 'react';
import { DataTable } from './components/DataTable';
import { FilterConfig, DataTableState } from './types';

// 1. Define Filter Configuration
const FILTERS_CONFIG: FilterConfig[] = [
  {
    id: 'category',
    label: 'الفئة',
    type: 'select',
    options: [
      { label: 'كفالة أيتام', value: 'orphans' },
      { label: 'كفالة تعليم', value: 'education' },
      { label: 'كفالة طبية', value: 'medical' },
    ]
  },
  {
    id: 'status',
    label: 'الحالة',
    type: 'select',
    options: [
      { label: 'نشط', value: 'active' },
      { label: 'مكتمل', value: 'completed' },
      { label: 'متوقف', value: 'paused' },
    ]
  }
];

// 2. Mock API call implementation
const fetchSponsorships = async (state: DataTableState) => {
  // Build query params for API
  const params = new URLSearchParams();
  
  // Search
  if (state.search) params.set('search', state.search);
  
  // Pagination
  params.set('page', state.page.toString());
  params.set('limit', state.limit.toString());
  
  // Dynamic Filters
  Object.entries(state.filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  console.log(`Fetching from: /api/v1/sponsorships?${params.toString()}`);

  // In real app: return await api.get(`/v1/sponsorships?${params.toString()}`);
  return {
    data: [], // Actual data items
    pagination: {
      total: 100,
      page: state.page,
      limit: state.limit,
      totalPages: 10,
      hasNext: state.page < 10,
      hasPrev: state.page > 1,
    }
  };
};

export const SponsorshipsTableExample = () => {
  return (
    <DataTable
      title="إدارة برامج الكفالة"
      description="عرض وتحرير جميع برامج الكفالة المتاحة في النظام"
      fetchData={fetchSponsorships}
      filtersConfig={FILTERS_CONFIG}
      headers={['البرنامج', 'الفئة', 'المبلغ المستهدف', 'الحالة', 'الإجراءات']}
      renderRow={(item: any) => (
        <tr key={item.id} className="hover:bg-gray-50/50 transition-all border-b border-gray-50">
          <td className="px-8 py-5 font-bold font-[Cairo]">{item.title}</td>
          <td className="px-8 py-5 font-[Cairo]">{item.category}</td>
          <td className="px-8 py-5 font-[Cairo]">{item.amount} ج.م</td>
          <td className="px-8 py-5">
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold font-[Cairo]">
              {item.status}
            </span>
          </td>
          <td className="px-8 py-5 text-left">
             {/* Action buttons */}
          </td>
        </tr>
      )}
    />
  );
};
