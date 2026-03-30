import { get, post } from './api';

// Domain-level API wrappers for the Oracle backend.
const hasConfiguredApi = Boolean(process.env.REACT_APP_API_BASE_URL);

const mockUploadHistory = [
  {
    id: 'upl-1001',
    fileName: 'pastel-fresa-01.jpg',
    sizeBytes: 1589240,
    createdAt: '2026-03-25T13:20:00Z',
    status: 'PROCESSED',
  },
  {
    id: 'upl-1002',
    fileName: 'brownie-packaging.png',
    sizeBytes: 842110,
    createdAt: '2026-03-27T09:45:00Z',
    status: 'QUEUED',
  },
  {
    id: 'upl-1003',
    fileName: 'cupcake-display.webp',
    sizeBytes: 468332,
    createdAt: '2026-03-28T17:04:00Z',
    status: 'PROCESSED',
  },
];

export function fetchDashboardSummary() {
  if (!hasConfiguredApi) {
    return Promise.resolve({
      totalUploads: mockUploadHistory.length,
      pendingUploads: mockUploadHistory.filter((item) => item.status !== 'PROCESSED').length,
    });
  }

  return get('/dashboard/summary');
}

export function fetchUploadHistory(params = {}) {
  if (!hasConfiguredApi) {
    return Promise.resolve(mockUploadHistory);
  }

  return get('/uploads', { query: params });
}

export function uploadCakePhoto(formData) {
  if (!hasConfiguredApi) {
    return Promise.resolve({
      id: `upl-${Date.now()}`,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
      fileName: formData?.get ? formData.get('file')?.name || 'new-upload' : 'new-upload',
    });
  }

  return post('/uploads', formData);
}
