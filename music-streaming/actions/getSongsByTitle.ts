import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types";

const getSongsByTitle = async (
    title: string,
    genres: string[],
    limitResults: boolean = false
): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    try {
        let query = supabase
            .from('songs')
            .select('*');

        // Apply genre filter if genres are selected
        if (genres && genres.length > 0) {
            query = query.in('genre', genres);
        }

        // Apply title search if present
        if (title) {
            query = query.ilike('title', `%${title}%`);
        }

        // Show last 10 recently added/searched songs when no search term
        if (limitResults && !title) {
            query = query
                .order('created_at', { ascending: false })
                .limit(10);
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
            console.error('Search error:', error);
            return [];
        }

        return (data as Song[]) || [];
    } catch (error) {
        console.error('Unexpected error:', error);
        return [];
    }
};

export default getSongsByTitle;