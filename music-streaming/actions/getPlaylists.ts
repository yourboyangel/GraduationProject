import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export interface Playlist {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    image_path: string;
    created_at: string;
}

const getPlaylists = async (): Promise<Playlist[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return [];
    }

    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return [];
    }

    return data || [];
};

export default getPlaylists;