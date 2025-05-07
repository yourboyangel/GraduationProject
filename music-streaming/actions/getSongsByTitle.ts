import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types";

const getSongsByTitle = async (
    title: string,
    genres: string[],
    limitResults: boolean = false
): Promise<Song[]> => {
    try {
        const supabase = createServerComponentClient({
            cookies: cookies
        });

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('No authenticated user found');
            return [];
        }

        let query = supabase
            .from('songs')
            .select('*')
            .eq('user_id', user.id);

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

        if (error !== null) {
            console.error('Search error:', error);
            return [];
        }

        return (data as Song[]) || [];
    } catch (error) {
        console.error('Unexpected error in getSongsByTitle:', error);
        return [];
    }
};

export default getSongsByTitle;