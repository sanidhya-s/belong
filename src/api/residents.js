import { apiRequest } from './client';

export function mapResidentFromBackend(item) {
  return {
    id: String(item.id),
    name: item.fullName,
    flat: item.flatNumber || 'N/A',
    society: 'Green Valley Residency',
    phone: item.phone,
    role: item.role || 'resident',
  };
}

export async function fetchResidents() {
  const data = await apiRequest('/residents');
  return Array.isArray(data) ? data.map(mapResidentFromBackend) : [];
}
