export const API_PATH_GUIDE = {
  emergencyCases: {
    payments: {
      pending: '/v1/emergency-cases/payments/pending',
      pendingByMethod: (method: string) => `/v1/emergency-cases/payments/pending/${method}`,
      verify: (id: number) => `/v1/emergency-cases/payments/${id}/verify`,
      reject: (id: number) => `/v1/emergency-cases/payments/${id}/reject`,
    },
  },
  deliveryAreas: {
    admin: '/v1/subscriptions/delivery-areas/admin',
  },
};
