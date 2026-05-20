import { apiRequest } from '../services/api.service';
import { saveToken } from '../services/auth.service';

export async function registerUser(payload) {
  const response = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return response.data;
}

export async function loginUser(payload) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (response?.data?.token) {
    saveToken(response.data.token);
  }

  return response.data;
}
