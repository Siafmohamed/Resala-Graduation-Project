import { useState, useMemo } from "react";
import { 
  useSponsorships, 
  useCreateSponsorship, 
  useUpdateSponsorship, 
  useDeleteSponsorship 
} from "./useSponsorships";
import { 
  useEmergencyCases, 
  useCreateEmergencyCase, 
  useUpdateEmergencyCase, 
  useDeleteEmergencyCase 
} from "@/features/EmergencyCases/hooks/useEmergencyCases";
import { normalizeUrgencyLevel } from "@/api/services/sponsorshipService";

export type ModalStep = null | "choose-type" | "add-regular" | "add-urgent" | "edit-regular" | "edit-urgent" | "delete-regular" | "delete-urgent";

export const useCaseManagementLogic = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("جميع الحالات");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [modal, setModal] = useState<ModalStep>(null);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  // --- Sponsorships Queries & Mutations ---
  const { data: sponsorships = [], isLoading: loadingSponsorships, isError: errorSponsorships } = useSponsorships();
  const createSponsorshipMutation = useCreateSponsorship();
  const updateSponsorshipMutation = useUpdateSponsorship();
  const deleteSponsorshipMutation = useDeleteSponsorship();

  // --- Emergency Cases Queries & Mutations ---
  const { data: emergencyCases = [], isLoading: loadingEmergency, isError: errorEmergency } = useEmergencyCases();
  const createEmergencyMutation = useCreateEmergencyCase();
  const updateEmergencyMutation = useUpdateEmergencyCase();
  const deleteEmergencyMutation = useDeleteEmergencyCase();

  const isLoading = loadingSponsorships || loadingEmergency;
  const isError = errorSponsorships || errorEmergency;

  const toSafeId = (id: unknown): number | null => {
    const parsed = typeof id === "number" ? id : Number(id);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  };

  const handleCreateSponsorship = (data: FormData) =>
    createSponsorshipMutation.mutate(data, { onSuccess: () => setModal(null) });

  const handleUpdateSponsorship = (id: number, data: FormData) => {
    const safeId = toSafeId(id);
    if (!safeId) return;
    updateSponsorshipMutation.mutate(
      { id: safeId, payload: data },
      { onSuccess: () => { setModal(null); setSelectedProgram(null); } },
    );
  };

  const handleDeleteSponsorship = (id: number) => {
    const safeId = toSafeId(id);
    if (!safeId) return;
    deleteSponsorshipMutation.mutate(
      safeId,
      { onSuccess: () => { setModal(null); setSelectedProgram(null); } },
    );
  };

  const handleCreateEmergency = (data: FormData) =>
    createEmergencyMutation.mutate(data, { onSuccess: () => setModal(null) });

  const handleUpdateEmergency = (id: number, data: FormData) => {
    const safeId = toSafeId(id);
    if (!safeId) return;
    updateEmergencyMutation.mutate(
      { id: safeId, payload: data },
      { onSuccess: () => { setModal(null); setSelectedProgram(null); } },
    );
  };

  const handleDeleteEmergency = (id: number) => {
    const safeId = toSafeId(id);
    if (!safeId) return;
    deleteEmergencyMutation.mutate(
      safeId,
      { onSuccess: () => { setModal(null); setSelectedProgram(null); } },
    );
  };

  // Merge and normalize data
  const combinedData = useMemo(() => {
    const normSponsorships = sponsorships.map(s => ({ 
      ...s, 
      caseType: 'regular' as const, 
      title: s.name,
      targetAmount: Number(s.targetAmount) || 0,
      collectedAmount: Number(s.collectedAmount) || 0,
      urgencyLevel: normalizeUrgencyLevel(s.urgencyLevel),
      createdAt: s.createdAt || new Date().toISOString()
    }));
    const normEmergency = emergencyCases.map(e => ({ 
      ...e, 
      caseType: 'urgent' as const,
      title: e.title,
      targetAmount: Number(e.targetAmount) || 0,
      collectedAmount: Number(e.collectedAmount) || 0,
      urgencyLevel: normalizeUrgencyLevel(e.urgencyLevel),
      createdAt: e.createdOn || new Date().toISOString()
    }));
    return [...normSponsorships, ...normEmergency].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [sponsorships, emergencyCases]);

  const filtered = combinedData.filter((item) => {
    const searchTerm = search.toLowerCase();
    const title = String(item.title ?? "").toLowerCase();
    const description = String(item.description ?? "").toLowerCase();
    const matchSearch = title.includes(searchTerm) || description.includes(searchTerm);
    
    const matchFilter = filter === "جميع الحالات" || 
                       (filter === "كفالات" && item.caseType === 'regular') ||
                       (filter === "حالات حرجة" && item.caseType === 'urgent');

    return matchSearch && matchFilter;
  });

  return {
    search, setSearch,
    filter, setFilter,
    viewMode, setViewMode,
    modal, setModal,
    selectedProgram, setSelectedProgram,
    isLoading, isError,
    filtered,
    combinedData,
    sponsorships,
    emergencyCases,
    handleCreateSponsorship, handleUpdateSponsorship, handleDeleteSponsorship,
    handleCreateEmergency, handleUpdateEmergency, handleDeleteEmergency,
    createSponsorshipMutation, updateSponsorshipMutation, deleteSponsorshipMutation,
    createEmergencyMutation, updateEmergencyMutation, deleteEmergencyMutation
  };
};
