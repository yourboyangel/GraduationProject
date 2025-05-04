"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Playlist } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface PlaylistItemProps {
    data: Playlist;
    onClick: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
    data,
    onClick
}) => {
    const router = useRouter();
    const supabaseClient = useSupabaseClient();

    // Handle image URL based on whether it's default or from storage
    const imageUrl = data.image_path.startsWith('/images/') 
        ? data.image_path // Use as-is for default image
        : supabaseClient.storage
            .from('images')
            .getPublicUrl(data.image_path)
            .data.publicUrl;

    return (
        <button
            onClick={onClick}
            className="
                flex 
                items-center 
                gap-x-3 
                cursor-pointer 
                hover:bg-[#2D2053] 
                w-full 
                p-2 
                rounded-md
                transition
            "
        >
            <div className="
                relative 
                rounded-md 
                min-h-[48px] 
                min-w-[48px] 
                overflow-hidden
            ">
                <Image
                    fill
                    src={imageUrl || '/images/playlist.png'} // Fallback to default if URL is empty
                    alt="Playlist"
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col gap-y-1 overflow-hidden">
                <p className="text-white truncate">{data.name}</p>
                <p className="text-neutral-400 text-sm truncate">
                    Playlist
                </p>
            </div>
        </button>
    );
};

export default PlaylistItem;