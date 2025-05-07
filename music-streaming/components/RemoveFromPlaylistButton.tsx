"use client";

import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { IoMdRemove } from "react-icons/io";
import toast from "react-hot-toast";

interface RemoveFromPlaylistButtonProps {
    songId: string;
    playlistId: string;
}

const RemoveFromPlaylistButton: React.FC<RemoveFromPlaylistButtonProps> = ({
    songId,
    playlistId
}) => {
    const router = useRouter();
    const { supabaseClient } = useSessionContext();
    const { user } = useUser();

    const handleRemove = async () => {
        if (!user) {
            return;
        }

        try {
            const { error } = await supabaseClient
                .from('playlist_songs')
                .delete()
                .eq('song_id', songId)
                .eq('playlist_id', playlistId);

            if (error) {
                console.error('Error removing song:', error);
                toast.error("Failed to remove from playlist");
            } else {
                toast.success("Removed from playlist!");
                router.refresh();
            }
        } catch (error) {
            console.error('Error in handleRemove:', error);
            toast.error("Something went wrong");
        }
    };

    return (
        <button
            onClick={handleRemove}
            className="
                hover:opacity-75
                transition
                p-2
                rounded-full
                bg-neutral-400/10
                hover:bg-neutral-400/20
            "
        >
            <IoMdRemove size={20} className="text-white" />
        </button>
    );
};

export default RemoveFromPlaylistButton; 