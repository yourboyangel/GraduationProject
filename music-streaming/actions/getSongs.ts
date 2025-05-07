import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {
    try {
        const supabase = createServerComponentClient({
            cookies: cookies
        });

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log('No authenticated user found');
            return [];
        }

        const { data, error } = await supabase
            .from('songs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching songs:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Unexpected error in getSongs:', error);
        return [];
    }
};

export default getSongs;

export async function getSongsCount(): Promise<number> {
    try {
        const supabase = createServerComponentClient({
            cookies: cookies
        });

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return 0;
        }

        const { count, error } = await supabase
            .from('songs')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        if (error) {
            console.error('Error getting songs count:', error);
            return 0;
        }

        return count || 0;
    } catch (error) {
        console.error('Unexpected error in getSongsCount:', error);
        return 0;
    }
}