"use client";

import { Song } from "@/types";
import MediaItem from "@/components/MediaItem";
import LikeButton from "@/components/LikeButton";
import useOnPlay from "@/hooks/useOnPlay";
import RemoveFromPlaylistButton from "@/components/RemoveFromPlaylistButton";

interface PlaylistContentProps {
    songs: Song[];
    playlistId: string;
}

const PlaylistContent: React.FC<PlaylistContentProps> = ({
    songs,
    playlistId
}) => {
    const onPlay = useOnPlay(songs);

    if (songs.length === 0) {
        return (
            <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400">
                No songs in this playlist.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {songs.map((song) => (
                <div 
                    key={song.id} 
                    className="flex items-center gap-x-4 w-full"
                >
                    <div className="flex-1">
                        <MediaItem 
                            onClick={(id: string) => onPlay(id)} 
                            data={song}
                        />
                    </div>
                    <div className="flex gap-x-2 items-center">
                        <RemoveFromPlaylistButton 
                            songId={song.id} 
                            playlistId={playlistId}
                        />
                        <LikeButton songId={song.id} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PlaylistContent;