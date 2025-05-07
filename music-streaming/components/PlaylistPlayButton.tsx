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

        if (player.isShuffled) {
            // If shuffle is on, create a shuffled queue
            const shuffledSongs = [...songs];
            for (let i = shuffledSongs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
            }
            player.setIds(shuffledSongs.map(song => song.id));
            player.setId(shuffledSongs[0].id);
        } else {
            // If shuffle is off, use original order
            player.setIds(songs.map(song => song.id));
            player.setId(songs[0].id);
        }
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
                bg-[#2D2030]
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