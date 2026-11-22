export function shouldUseAI(status: string, enabled = true) {
  return enabled && status !== 'agent' && status !== 'whatsapp';
}