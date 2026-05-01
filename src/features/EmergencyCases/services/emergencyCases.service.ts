/**
 * @file emergencyCases.service.ts
 * @description Service for the EmergencyCases feature.
 * Moved from: src/features/SponsorshipCases/services/emergencyCases.service.ts
 *
 * Delegates all HTTP calls to the canonical API layer:
 *   src/api/services/sponsorshipService.ts → emergencyApi
 *
 * This thin wrapper exists so the feature owns a clean import boundary and
 * so future changes to the API layer don't scatter across hooks.
 */

import { emergencyApi } from '@/api/services/sponsorshipService';
import type { EmergencyCase, CreateEmergencyCasePayload, UpdateEmergencyCasePayload } from '../types/emergencyCase.types';

export const emergencyCasesService = {
  getAll: (params?: { isActive?: boolean }): Promise<EmergencyCase[]> =>
    emergencyApi.getAll(params) as Promise<EmergencyCase[]>,

  getById: (id: number): Promise<EmergencyCase> =>
    emergencyApi.getById(id) as Promise<EmergencyCase>,

  create: (payload: CreateEmergencyCasePayload | FormData): Promise<EmergencyCase> =>
    emergencyApi.create(payload) as Promise<EmergencyCase>,

  update: (id: number, payload: UpdateEmergencyCasePayload | FormData): Promise<EmergencyCase> =>
    emergencyApi.update(id, payload) as Promise<EmergencyCase>,

  delete: (id: number): Promise<void> =>
    emergencyApi.delete(id),
};

export default emergencyCasesService;
