import { apiRequest } from './client';

const STATUS_TO_FE = {
  PENDING: 'pending',
  APPROVED: 'approved',
  DENIED: 'denied',
};

const STATUS_TO_BE = {
  pending: 'PENDING',
  approved: 'APPROVED',
  denied: 'DENIED',
};

function initials(name = '') {
  return name.trim().charAt(0).toUpperCase() || 'V';
}

function avatarColor(status) {
  if (status === 'approved') return '#2ECC71';
  if (status === 'denied') return '#EF4444';
  return '#4F3EF5';
}

export function mapVisitorFromBackend(item) {
  const status = STATUS_TO_FE[item.status] || 'pending';
  return {
    id: String(item.id),
    name: item.visitorName,
    phone: item.phone || '',
    purpose: item.purpose || 'Personal Visit',
    vehicle: item.vehicleNumber || null,
    status,
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN') : 'Today',
    time: item.createdAt
      ? new Date(item.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    avatar: initials(item.visitorName),
    avatarColor: avatarColor(status),
  };
}

export async function fetchVisitors() {
  const data = await apiRequest('/visitors');
  return Array.isArray(data) ? data.map(mapVisitorFromBackend) : [];
}

export async function createVisitor(payload) {
  const data = await apiRequest('/visitors', {
    method: 'POST',
    body: JSON.stringify({
      visitorName: payload.name,
      purpose: payload.purpose || 'Personal Visit',
      phone: payload.phone || '',
      vehicleNumber: payload.vehicle || '',
      status: 'PENDING',
      residentFlatNumber: payload.residentFlatNumber || 'B-304',
    }),
  });
  return mapVisitorFromBackend(data);
}

export async function setVisitorStatus(id, status) {
  const backendStatus = STATUS_TO_BE[status] || 'PENDING';
  const data = await apiRequest(`/visitors/${id}/status?status=${backendStatus}`, {
    method: 'PATCH',
  });
  return mapVisitorFromBackend(data);
}
