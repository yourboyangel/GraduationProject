"use client";

import { TbArrowsShuffle } from "react-icons/tb";
import usePlayer from "@/hooks/usePlayer";
import { Song } from "@/types";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

interface ShuffleButtonProps {
    songs: Song[];
    className?: string;
}

const ShuffleButton: React.FC<ShuffleButtonProps> = ({
    songs,
    className
}) => {
    const player = usePlayer();

    const shuffleArray = (array: Song[]) => {
        let currentIndex = array.length;
        let randomIndex;

        // While there remain elements to shuffle
        while (currentIndex !== 0) {
            // Pick a remaining element
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // Swap it with the current element
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }

        return array;
    };

    const handleShuffle = () => {
        if (player.isShuffled) {
            // Restore original order
            player.setIds(songs.map(song => song.id));
            player.setIsShuffled(false);
        } else {
            // Create a new array and shuffle it
            const shuffledSongs = shuffleArray([...songs]);
            
            // Start with current song if one is playing
            if (player.activeId) {
                const currentSong = shuffledSongs.find(song => song.id === player.activeId);
                if (currentSong) {
                    const index = shuffledSongs.indexOf(currentSong);
                    shuffledSongs.splice(index, 1);
                    shuffledSongs.unshift(currentSong);
                }
            }

            player.setIds(shuffledSongs.map(song => song.id));
            player.setIsShuffled(true);
        }

        // Start playing if not already
        if (!player.activeId && songs.length > 0) {
            player.setId(songs[0].id);
        }
    };

    return (
        <motion.button
            onClick={handleShuffle}
            whileTap={{ scale: 0.95 }}
            animate={{
                rotate: player.isShuffled ? [0, 360] : 0,
                scale: player.isShuffled ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.3 }}
            className={twMerge(`
                text-neutral-400
                transition-all
                duration-300
                ease-in-out
                p-2
                rounded-full
                transform
                shadow-lg
                hover:shadow-purple-500/25
                ${player.isShuffled 
                    ? 'text-white bg-[#2D2053] hover:bg-[#422B92] ring-2 ring-purple-500/50' 
                    : 'hover:text-white bg-[#15132B] hover:bg-[#2D2053]'}
            `, className)}
            title={player.isShuffled ? "Disable shuffle" : "Enable shuffle"}
        >
            <TbArrowsShuffle 
                size={22} 
                className={`
                    transition-transform 
                    duration-300 
                    ${player.isShuffled ? 'rotate-180' : ''}
                `}
            />
        </motion.button>
    );
};

export default ShuffleButton;