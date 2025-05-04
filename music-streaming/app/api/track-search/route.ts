import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { userId, songId } = await request.json();
        const supabase = createRouteHandlerClient({ cookies });

        await supabase
            .from('search_history')
            .upsert({
                user_id: userId,
                song_id: songId,
                created_at: new Date().toISOString()
            }, {
                onConflict: 'user_id,song_id'
            });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error tracking search:', error);
        return NextResponse.json(
            { error: 'Failed to track search' },
            { status: 500 }
        );
    }
}