/**
 * @file index.ts
 * @description Public barrel export for the EmergencyCases feature.
 */

// --- Pages ---
export { default as EmergencyCasesPage } from './pages/EmergencyCasesPage';

// --- Hooks ---
export { 
  useEmergencyCases, 
  useEmergencyCase, 
  emergencyQueryKeys 
} from './hooks/useEmergencyCases';
export { useCreateEmergencyCase } from './hooks/useCreateEmergencyCase';
export { useUpdateEmergencyCase } from './hooks/useUpdateEmergencyCase';
export { useDeleteEmergencyCase } from './hooks/useDeleteEmergencyCase';
export { useEmergencyManagementLogic } from './hooks/useEmergencyManagementLogic';

// --- Components ---
export { EmergencyCard } from './components/list/EmergencyCard';
export { EmergencyTableRow } from './components/list/EmergencyTableRow';
export { EmergencyFormModal } from './components/modals/EmergencyFormModal';

// --- Service ---
export { emergencyCasesService } from './services/emergencyCases.service';

// --- Types ---
export type {
  EmergencyCase,
  CreateEmergencyCasePayload,
  UpdateEmergencyCasePayload,
} from './types/emergencyCase.types';
