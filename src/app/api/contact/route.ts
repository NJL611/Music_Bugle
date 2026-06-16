import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_TO_EMAIL } from '@/lib/constants';

const INQUIRY_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  press: 'Press Inquiry',
  tip: 'Story Tip',
  feedback: 'Feedback',
  partnership: 'Partnership',
};

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return NextResponse.json({ error: 'Contact form is not configured.' }, { status: 503 });
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, subject, message, inquiryType, website } = body as Record<string, unknown>;

  if (typeof website === 'string' && website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof subject !== 'string' ||
    typeof message !== 'string' ||
    typeof inquiryType !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedSubject = subject.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
  }

  if (!isValidEmail(trimmedEmail)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  if (trimmedMessage.length > 10000) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  const inquiryLabel = INQUIRY_LABELS[inquiryType] || inquiryType;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: CONTACT_TO_EMAIL,
    replyTo: trimmedEmail,
    subject: `[${inquiryLabel}] ${trimmedSubject}`,
    text: [
      `Inquiry type: ${inquiryLabel}`,
      `Name: ${trimmedName}`,
      `Email: ${trimmedEmail}`,
      '',
      trimmedMessage,
    ].join('\n'),
  });

  if (error) {
    console.error('Resend error:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
