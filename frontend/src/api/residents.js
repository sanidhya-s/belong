import { apiRequest } from './client';

export function mapResidentFromBackend(item) {
  return {
    id: String(item.id),
    name: item.name || item.fullName || 'Resident',
    flat: item.unit || item.flatNumber || 'N/A',
    society: 'Sunshine Residency',
    phone: item.phone,
    role: (item.role || 'resident').toLowerCase(),
  };
}

export async function fetchResidents() {
  const data = await apiRequest('/visitors/residents');
  return Array.isArray(data) ? data.map(mapResidentFromBackend) : [];
}
