import { NextResponse } from 'next/server'
import {createClient} from '@/utils/supabase/server';


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const body = await req.json()

  const { error } = await supabase
    .from('todos')
    .update(body)
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
