import { apiRequest } from '../services/api.service';

export async function getSummary() {
  const response = await apiRequest('/dashboard/summary');
  return response.data;
}

export async function getRecent() {
  const response = await apiRequest('/dashboard/recent');
  return response.data;
}

export async function getCategoryTotals() {
  const response = await apiRequest('/dashboard/category');
  return response.data;
}

export async function getCategoryBreakdown() {
  const response = await apiRequest('/dashboard/category-breakdown');
  return response.data;
}

export async function getMonthlyFinance() {
  const response = await apiRequest('/dashboard/finance/monthly');
  return response.data;
}

export async function getQuarterlyFinance() {
  const response = await apiRequest('/dashboard/finance/quarterly');
  return response.data;
}

export async function getYearlyFinance() {
  const response = await apiRequest('/dashboard/finance/yearly');
  return response.data;
}
