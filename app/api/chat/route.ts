import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { AYORINDE_SYSTEM_PROMPT } from '@/lib/ai/system-prompt';

// Simple in-memory rate limiter (5 req/min per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response('Rate limit exceeded. Please wait a minute.', { status: 429 });
  }

  const { messages } = await req.json();
  const limited = messages.slice(-10);

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system: AYORINDE_SYSTEM_PROMPT,
    messages: limited,
  });

  return result.toTextStreamResponse();
}
