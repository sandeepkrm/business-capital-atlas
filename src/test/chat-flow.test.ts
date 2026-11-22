import { describe, expect, it } from 'vitest';
import { shouldUseAI } from '@/lib/chat-flow';
describe('AI-first handover flow', () => {
  it('answers initial conversations with AI', () => expect(shouldUseAI('open')).toBe(true));
  it('stops AI after WhatsApp handover', () => expect(shouldUseAI('whatsapp')).toBe(false));
  it('stops AI when a staff member takes over', () => expect(shouldUseAI('agent')).toBe(false));
  it('honours the admin AI switch', () => expect(shouldUseAI('open', false)).toBe(false));
});