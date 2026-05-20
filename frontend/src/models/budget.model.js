export function createBudgetModel(data = {}) {
  return {
    category: data.category || '',
    limit: data.limit || 0
  };
}
