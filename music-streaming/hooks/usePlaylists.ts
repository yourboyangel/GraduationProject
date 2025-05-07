import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Playlist } from "@/types";
import { useUser } from "./useUser";

const usePlaylists = () => {
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    const { data: playlists = [], isLoading, error } = useQuery({
        queryKey: ['playlists', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];

            const { data, error } = await supabaseClient
                .from('playlists')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data as Playlist[];
        },
        enabled: !!user?.id,
        staleTime: 60 * 1000, // 1 minute
    });

    return {
        playlists,
        isLoading,
        error
    };
};

export default usePlaylists; 