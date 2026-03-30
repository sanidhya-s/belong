import { apiRequest } from './client';

function formatDate(isoDate) {
  if (!isoDate) return 'Today';
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function mapNoticeFromBackend(item) {
  return {
    id: String(item.id),
    title: item.title,
    body: item.body,
    type: item.type || 'info',
    read: Boolean(item.read),
    date: formatDate(item.createdAt),
  };
}

export async function fetchNotices() {
  const data = await apiRequest('/notices');
  return Array.isArray(data) ? data.map(mapNoticeFromBackend) : [];
}

export async function markNoticeRead(id) {
  const data = await apiRequest(`/notices/${id}/read`, { method: 'PATCH' });
  return mapNoticeFromBackend(data);
}
