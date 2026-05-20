export function createRecordModel(data = {}) {
  return {
    amount: data.amount || 0,
    type: data.type || 'EXPENSE',
    category: data.category || '',
    notes: data.notes || '',
    date: data.date || ''
  };
}
