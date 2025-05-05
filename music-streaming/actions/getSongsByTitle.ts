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

    const { data: { session } } = await supabase.auth.getSession();

    try {
        let query = supabase
            .from('songs')
            .select('*')
            .eq('user_id', session?.user?.id);

        // Apply genre filter if genres are selected
        if (genres && genres.length > 0) {
            query = query.in('genre', genres);
        }

        // Apply title search if present
        if (title) {
            query = query.ilike('title', `%${title}%`);
        }

        // Limit results if needed
        if (limitResults && !title) {
            query = query.limit(10);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error && (error.message || Object.keys(error).length > 0)) {
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