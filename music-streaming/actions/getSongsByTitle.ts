import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

import { Song } from "@/types";

export default async function getSongsByTitle(query: string): Promise<Song[]> {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    if (!query) {
        return [];
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .or(`title.ilike.%${query}%,author.ilike.%${query}%`)
        .order('title', { ascending: true })
        .limit(50);

    if (error) {
        console.error(error);
        return [];
    }

    return (data as any) || [];
}