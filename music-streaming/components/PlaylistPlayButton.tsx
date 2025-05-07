"use client";

import { BsPlayFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";

interface PlaylistPlayButtonProps {
    songs: Song[];
    className?: string;
}

const PlaylistPlayButton: React.FC<PlaylistPlayButtonProps> = ({
    songs,
    className
}) => {
    const router = useRouter();
    const player = usePlayer();

    const onClick = () => {
        if (songs.length === 0) {
            return;
        }

        player.setId(songs[0].id);
        player.setIds(songs.map((song) => song.id));
    }

    return (
        <button
            onClick={onClick}
            className={`
                flex 
                items-center 
                justify-center
                h-10
                w-10 
                rounded-full 
                bg-[#2D2053]
                p-1 
                cursor-pointer
                hover:scale-110
                transition
                ${className}
            `}
        >
            <BsPlayFill className="text-white" size={30} />
        </button>
    );
}

export default PlaylistPlayButton; 