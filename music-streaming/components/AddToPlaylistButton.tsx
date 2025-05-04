"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdPlaylistAdd } from "react-icons/md";
import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";

interface AddToPlaylistButtonProps {
    songId: string;
}

const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({
    songId
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();
    const authModal = useAuthModal();
    const { user } = useUser();
    const [playlists, setPlaylists] = useState<any[]>([]);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (!user?.id) return;

        const fetchPlaylists = async () => {
            const { data, error } = await supabaseClient
                .from('playlists')
                .select('*')
                .eq('user_id', user.id);

            if (!error && data) {
                setPlaylists(data);
            }
        };

        fetchPlaylists();
    }, [supabaseClient, user?.id]);

    const handleAddToPlaylist = async (playlistId: string) => {
        if (!user) {
            return authModal.onOpen();
        }

        try {
            const { error } = await supabaseClient
                .from('playlist_songs')
                .insert({
                    song_id: songId,
                    playlist_id: playlistId
                });

            if (error) {
                if (error.code === '23505') { // Unique violation error code
                    toast.error("Song already in playlist");
                } else {
                    toast.error("Failed to add to playlist");
                }
            } else {
                toast.success("Added to playlist!");
                router.refresh();
                window.location.reload(); // Add immediate page refresh
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setShowMenu(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="
                    hover:opacity-75
                    transition
                "
            >
                <MdPlaylistAdd
                    size={25}
                    className="text-neutral-400 hover:text-white"
                />
            </button>
            {showMenu && (
                <div 
                    className="
                        absolute
                        bottom-full
                        right-0
                        mb-2
                        w-48
                        bg-[#2D2053]
                        rounded-md
                        shadow-lg
                        py-1
                        z-10
                    "
                >
                    {playlists.length === 0 ? (
                        <p className="px-4 py-2 text-sm text-neutral-400">
                            No playlists found
                        </p>
                    ) : (
                        playlists.map((playlist) => (
                            <button
                                key={playlist.id}
                                onClick={() => handleAddToPlaylist(playlist.id)}
                                className="
                                    w-full
                                    px-4
                                    py-2
                                    text-sm
                                    text-white
                                    hover:bg-[#422B92]
                                    text-left
                                    transition
                                "
                            >
                                {playlist.name}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AddToPlaylistButton;