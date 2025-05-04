import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types";

export default async function getRecentSearches(): Promise<Song[]> {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) return [];

    // Get the 10 most recent unique songs from search history
    const { data: searchHistory } = await supabase
        .from('search_history')
        .select('song_id')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    if (!searchHistory || searchHistory.length === 0) return [];

    // Get the actual songs
    const songIds = searchHistory.map(history => history.song_id);
    const { data: songs } = await supabase
        .from('songs')
        .select('*')
        .in('id', songIds)
        .order('created_at', { ascending: false });

    return songs || [];
}

export async function trackSearch(userId: string, songId: number) {
    try {
        const response = await fetch('/api/track-search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, songId }),
        });

        if (!response.ok) {
            throw new Error('Failed to track search');
        }
    } catch (error) {
        console.error('Failed to track search:', error);
    }
}