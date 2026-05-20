import { apiRequest } from '../services/api.service';

export async function createBudget(payload) {
  const response = await apiRequest('/budget', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return response.data;
}

export async function checkBudgets() {
  const response = await apiRequest('/budget/check');
  return response.data;
}
