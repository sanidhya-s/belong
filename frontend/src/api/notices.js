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
    body: item.content,
    type: (item.category || 'info').toLowerCase(),
    read: false,
    date: formatDate(item.createdAt),
  };
}

export async function fetchNotices() {
  const data = await apiRequest('/societies/1/notices');
  return Array.isArray(data) ? data.map(mapNoticeFromBackend) : [];
}

export async function markNoticeRead(id) {
  return null;
}
