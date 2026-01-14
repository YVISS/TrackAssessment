import {createClient} from '@/utils/supabase/server';
import { error } from 'console';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
    const supabase = await createClient();
    const {title} = await req.json();

    //check if user is authorized
    const {data: {user}} = await supabase.auth.getUser();
    if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const {error} = await supabase.from('todos').insert({title, user_id: user.id})

    error && NextResponse.json({error: error.message}, {status: 400});

    return NextResponse.json({success: true});
}

export async function GET() {
    const supabase = await createClient();

    //check if user is authorized
    const {data: {user}} = await supabase.auth.getUser();
    if(!user) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    const {data, error} = await supabase.from('todos').select('*').order('created_at', {ascending: false})

    error && NextResponse.json({error: error.message}, {status: 400});

    return NextResponse.json({todos: data});
}