import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

async function verifyAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET() {
  if (!await verifyAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const profile = await prisma.profile.findFirst();
  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  if (!await verifyAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...data } = await req.json();
  const profile = await prisma.profile.upsert({
    where: { id: id || 'none' },
    update: data,
    create: data,
  });
  return NextResponse.json(profile);
}
