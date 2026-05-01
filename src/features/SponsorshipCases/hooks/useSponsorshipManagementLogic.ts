import { useState, useMemo } from "react";
import { 
  useSponsorships, 
  useCreateSponsorship, 
  useUpdateSponsorship, 
  useDeleteSponsorship 
} from "../hooks/useSponsorships";
import type { Sponsorship } from "../types/sponsorship.types";

export const useSponsorshipManagementLogic = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modal, setModal] = useState<null | "add" | "edit" | "delete">(null);
  const [selectedSponsorship, setSelectedSponsorship] = useState<Sponsorship | null>(null);

  const { data: sponsorships = [], isLoading, isError } = useSponsorships();
  const createMutation = useCreateSponsorship();
  const updateMutation = useUpdateSponsorship();
  const deleteMutation = useDeleteSponsorship();

  const filteredSponsorships = useMemo(() => {
    return sponsorships.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                           s.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || 
                           (statusFilter === "active" && s.isActive) || 
                           (statusFilter === "inactive" && !s.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [sponsorships, search, statusFilter]);

  const handleCreate = (data: FormData) => createMutation.mutate(data, { onSuccess: () => setModal(null) });
  const handleUpdate = (id: number, data: FormData) => updateMutation.mutate({ id, payload: data }, { onSuccess: () => { setModal(null); setSelectedSponsorship(null); } });
  const handleDelete = (id: number) => deleteMutation.mutate(id, { onSuccess: () => { setModal(null); setSelectedSponsorship(null); } });

  return {
    search, setSearch,
    statusFilter, setStatusFilter,
    viewMode, setViewMode,
    modal, setModal,
    selectedSponsorship, setSelectedSponsorship,
    isLoading, isError,
    filteredSponsorships,
    handleCreate, handleUpdate, handleDelete,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
