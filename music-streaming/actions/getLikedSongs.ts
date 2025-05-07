import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies} from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {
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
            .from('liked_songs')
            .select('*, songs(*)')
            .eq('user_id', user.id)
            .order('created_at', {ascending: false});

        if(error) {
            console.error('Error fetching liked songs:', error);
            return [];
        }

        if(!data){
            return [];
        }

        return data.map( (item) => ({
            ...item.songs
        }));
    } catch (error) {
        console.error('Unexpected error in getLikedSongs:', error);
        return [];
    }
};

export default getLikedSongs;