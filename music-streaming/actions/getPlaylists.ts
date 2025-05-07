import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Playlist } from "@/types";

const getPlaylists = async (): Promise<Playlist[]> => {
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
            .from('playlists')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching playlists:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Unexpected error in getPlaylists:', error);
        return [];
    }
};

export default getPlaylists;