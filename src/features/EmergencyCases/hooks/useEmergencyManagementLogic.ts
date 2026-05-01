import { useState, useMemo } from "react";
import { 
  useEmergencyCases, 
  useCreateEmergencyCase, 
  useUpdateEmergencyCase, 
  useDeleteEmergencyCase 
} from "../hooks/useEmergencyCases";
import type { EmergencyCase } from "../types/emergencyCase.types";

export const useEmergencyManagementLogic = () => {
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modal, setModal] = useState<null | "add" | "edit" | "delete">(null);
  const [selectedCase, setSelectedCase] = useState<EmergencyCase | null>(null);

  const { data: cases = [], isLoading, isError } = useEmergencyCases();
  const createMutation = useCreateEmergencyCase();
  const updateMutation = useUpdateEmergencyCase();
  const deleteMutation = useDeleteEmergencyCase();

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                           c.description.toLowerCase().includes(search.toLowerCase());
      const matchesUrgency = urgencyFilter === "all" || String(c.urgencyLevel) === urgencyFilter;
      return matchesSearch && matchesUrgency;
    });
  }, [cases, search, urgencyFilter]);

  const handleCreate = (data: FormData) => createMutation.mutate(data, { onSuccess: () => setModal(null) });
  const handleUpdate = (id: number, data: FormData) => updateMutation.mutate({ id, payload: data }, { onSuccess: () => { setModal(null); setSelectedCase(null); } });
  const handleDelete = (id: number) => deleteMutation.mutate(id, { onSuccess: () => { setModal(null); setSelectedCase(null); } });

  return {
    search, setSearch,
    urgencyFilter, setUrgencyFilter,
    viewMode, setViewMode,
    modal, setModal,
    selectedCase, setSelectedCase,
    isLoading, isError,
    filteredCases,
    handleCreate, handleUpdate, handleDelete,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};
