import { Platform } from 'react-native';

// Android emulator cannot access localhost directly.
const defaultHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || `http://${defaultHost}:8080/api`;

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
