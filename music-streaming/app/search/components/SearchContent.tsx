"use client";

import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import usePlayer from "@/hooks/usePlayer"; // Add this import

interface SearchContentProps {
    songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({
    songs
}) => {
    const player = usePlayer();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();

    const handleSongClick = async (song: Song) => {
        if (!user?.id) return;

        try {
            // Track the search and play
            await supabaseClient
                .from('search_history')
                .upsert({
                    user_id: user.id,
                    song_id: song.id,
                    created_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,song_id'
                });

            // Play the song
            player.setId(song.id);
        } catch (error) {
            console.error('Failed to track search:', error);
        }
    };

    if (songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
                No songs found.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full px-6">
            {songs.map((song) => (
                <div
                    key={song.id}
                    className="flex items-center gap-x-4 w-full"
                >
                    <div className="flex-1">
                        <MediaItem 
                            onClick={() => handleSongClick(song)} 
                            data={song}
                        />
                    </div>
                    <LikeButton songId={song.id} />
                </div>
            ))}
        </div>
    );
}

export default SearchContent;