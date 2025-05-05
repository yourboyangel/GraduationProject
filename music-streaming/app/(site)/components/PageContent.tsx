"use client";

import SongItem from "@/components/SongItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Song } from "@/types";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import SeeMoreButton from "./SeeMoreButton";
import { useUser } from "@/hooks/useUser";

interface PageContentProps {
    songs: Song[];
}

const PageContent: React.FC<PageContentProps> = ({
    songs: initialSongs
}) => {
    const onPlay = useOnPlay(initialSongs);
    const [songs, setSongs] = useState<Song[]>(initialSongs);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    useEffect(() => {
        if (!user) {
            setSongs([]);
            setHasMore(false);
        } else {
            setSongs(initialSongs);
            setHasMore(initialSongs.length >= 10);
        }
    }, [user, initialSongs]);

    const loadMore = async () => {
        if (!user) return;
        
        try {
            setIsLoading(true);
            const { data, error } = await supabaseClient
                .from('songs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .range(songs.length, songs.length + 10);

            if (error) throw error;
            if (data.length < 10) setHasMore(false);
            setSongs([...songs, ...data]);
        } catch (error) {
            console.error('Error loading more songs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="mt-4 text-neutral-400">
                Please log in to view songs.
            </div>
        )
    }

    if (songs.length === 0) {
        return (
            <div className="mt-4 text-neutral-400">
                No songs available.
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-4">
            <div
                className="
                grid
                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-8
                gap-4
                mt-4
                "
            >
                {songs.map((item) => (
                    <SongItem
                        key={item.id}
                        onClick={(id: string) => { onPlay(id) }}
                        data={item}
                    />
                ))}
            </div>
            {hasMore && (
                <div className="flex justify-center mt-4 mb-4">
                    <SeeMoreButton
                        onLoadMore={loadMore}
                        isLoading={isLoading}
                    />
                </div>
            )}
        </div>
    );
}

export default PageContent;