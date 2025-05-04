import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types";

export default async function getSongs(limit: number = 10): Promise<Song[]> {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data: songs, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error(error);
        return [];
    }

    return songs || [];
}

export async function getSongsCount(): Promise<number> {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { count, error } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error(error);
        return 0;
    }

    return count || 0;
}