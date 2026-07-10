import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { donorChatService } from '../services/donorChatService';

export const useDonors = (initialSearch: string = '', initialPage: number = 1, pageSize: number = 20) => {
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const query = useQuery({
    queryKey: ['donors', debouncedSearch, page, pageSize],
    queryFn: () => donorChatService.getDonors({
      search: debouncedSearch,
      pageNumber: page,
      pageSize
    }),
    enabled: true,
  });

  return {
    ...query,
    search,
    setSearch,
    page,
    setPage,
  };
};
