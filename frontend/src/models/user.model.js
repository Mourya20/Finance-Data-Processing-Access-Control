export function createUserModel(data = {}) {
  return {
    email: data.email || '',
    password: data.password || '',
    role: data.role || 'VIEWER'
  };
}
