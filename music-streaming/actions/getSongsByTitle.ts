import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types";

export default async function getSongsByTitle(title: string, genres?: string): Promise<Song[]> {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    try {
        let query = supabase.from('songs').select('*');

        // Apply search filter
        if (title) {
            query = query.or(`title.ilike.%${title}%,author.ilike.%${title}%`);
        }

        // Apply genre filter
        if (genres && genres.length > 0) {
            const genreArray = genres.split(',');
            if (genreArray.length > 0) {
                query = query.in('genre', genreArray);
            }
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching songs:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Error in getSongsByTitle:', error);
        return [];
    }
}