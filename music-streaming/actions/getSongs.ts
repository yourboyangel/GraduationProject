import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (!session?.user) {
        return [];
    }

    const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.log(error);
        return [];
    }

    return data || [];
};

export default getSongs;

export async function getSongsCount(): Promise<number> {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    if (!session?.user) {
        return 0;
    }

    const { count, error } = await supabase
        .from('songs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

    if (error) {
        console.error(error);
        return 0;
    }

    return count || 0;
}