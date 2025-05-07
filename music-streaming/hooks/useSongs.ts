import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Song } from "@/types";
import { useUser } from "./useUser";

const useSongs = () => {
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    const { data: songs = [], isLoading, error } = useQuery({
        queryKey: ['songs', user?.id],
        queryFn: async () => {
            if (!user?.id) return [];

            const { data, error } = await supabaseClient
                .from('songs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return data as Song[];
        },
        enabled: !!user?.id,
        staleTime: 60 * 1000, // 1 minute
    });

    return {
        songs,
        isLoading,
        error
    };
};

export default useSongs; 