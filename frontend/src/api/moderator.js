import { apiRequest } from './client';

export async function fetchMembers() {
  const data = await apiRequest('/moderator/members');
  return Array.isArray(data) ? data : [];
}

export function addMember(payload) {
  return apiRequest('/moderator/members', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
