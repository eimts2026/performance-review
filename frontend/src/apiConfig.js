export const API_BASE_URL = import.meta.env.PROD
  ? '/_/backend'
  : (import.meta.env.VITE_API_URL || 'http://localhost:8800');
