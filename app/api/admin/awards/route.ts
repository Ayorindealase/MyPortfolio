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
  const items = await prisma.award.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  if (!await verifyAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const item = await prisma.award.create({ data });
  return NextResponse.json(item);
}

export async function PUT(req: Request) {
  if (!await verifyAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id, ...data } = await req.json();
  const item = await prisma.award.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(req: Request) {
  if (!await verifyAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id')!;
  await prisma.award.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
