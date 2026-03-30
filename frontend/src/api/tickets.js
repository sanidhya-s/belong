import { apiRequest } from './client';

function formatDate(isoDate) {
  if (!isoDate) return new Date().toLocaleDateString('en-IN');
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function mapTicketFromBackend(item) {
  return {
    id: String(item.id),
    title: item.title,
    category: item.category || 'Other',
    status: item.status || 'open',
    priority: item.priority || 'medium',
    date: formatDate(item.createdAt),
    description: item.description || '',
    updates: Array.isArray(item.comments) ? item.comments.map(c => `${c.userName}: ${c.content}`) : ['Ticket raised'],
  };
}

export async function fetchTickets() {
  const data = await apiRequest('/tickets/my');
  return Array.isArray(data) ? data.map(mapTicketFromBackend) : [];
}

export async function createTicket(payload) {
  const data = await apiRequest('/tickets', {
    method: 'POST',
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      category: payload.category,
      priority: payload.priority,
          }),
  });
  return mapTicketFromBackend(data);
}
