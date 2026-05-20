import { apiRequest, buildQuery } from '../services/api.service';

export async function fetchRecords({ page = 1, limit = 10, search = '' } = {}) {
  const query = buildQuery({ page, limit, search });
  const response = await apiRequest(`/records${query}`);
  return response.data || [];
}

export async function createRecord(payload) {
  const response = await apiRequest('/records', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return response.data;
}

export async function updateRecord(id, payload) {
  const response = await apiRequest(`/records/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
  return response.data;
}

export async function deleteRecord(id) {
  const response = await apiRequest(`/records/${id}`, {
    method: 'DELETE'
  });
  return response.data;
}
