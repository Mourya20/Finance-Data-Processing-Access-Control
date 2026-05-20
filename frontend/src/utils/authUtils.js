export function decodeJwtPayload(token) {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) return null;
    const decoded = atob(payloadSegment.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}
