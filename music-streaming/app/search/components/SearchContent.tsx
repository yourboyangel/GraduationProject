"use client";

import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import usePlayer from "@/hooks/usePlayer"; // Add this import
import AddToPlaylistButton from "@/components/AddToPlaylistButton";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface SearchContentProps {
    songs: Song[];
}

const SearchContent: React.FC<SearchContentProps> = ({
    songs
}) => {
    const player = usePlayer();
    const { user, isLoading } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

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

    const handleDelete = async (songId: string) => {
        if (!user?.id) {
            toast.error("You must be logged in to delete a song.");
            return;
        }
        const confirmDelete = window.confirm("Are you sure you want to delete this song? This action cannot be undone.");
        if (!confirmDelete) return;
        try {
            // Get the song to find its storage path
            const { data: songData, error: fetchError } = await supabaseClient
                .from('songs')
                .select('song_path')
                .eq('id', songId)
                .single();
            if (fetchError || !songData) {
                toast.error("Failed to find song file");
                return;
            }
            // Delete from songs table
            const { error } = await supabaseClient
                .from('songs')
                .delete()
                .eq('id', songId)
                .eq('user_id', user.id);
            if (error) {
                toast.error(error.message || "Failed to delete song");
                return;
            }
            // Delete from storage
            const { error: storageError } = await supabaseClient
                .storage
                .from('songs')
                .remove([songData.song_path]);
            if (storageError) {
                toast.error("Song deleted from database, but failed to delete file from storage");
            } else {
                toast.success("Song deleted");
            }
            router.refresh();
        } catch (err: any) {
            toast.error(err?.message || "Something went wrong");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
                Loading...
            </div>
        );
    }

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
                    <div className="flex gap-x-2 items-center">
                        <AddToPlaylistButton songId={song.id} />
                        <LikeButton songId={song.id} />
                        {user && String(user.id) === String(song.user_id) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(song.id);
                                }}
                                className="p-2 rounded-full bg-neutral-400/20 hover:bg-neutral-400/40 transition text-white"
                                title="Delete song"
                            >
                                🗑️
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SearchContent;