import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Song } from "@/types";

const DEFAULT_PLAYLIST_IMAGE = "/images/playlist.png";

export interface PlaylistWithSongs {
    id: string;
    name: string;
    image_path: string;
    user_id: string;
    description?: string;
    songs: Song[];
}

interface SongRow {
    songs: {
        id: string;
        user_id: string;
        title: string;
        author: string;
        song_path: string;
        image_path: string;
        created_at: string;
    } | null;
}

const getPlaylistById = async (playlistId: string): Promise<PlaylistWithSongs | null> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    try {
        // Get playlist details
        const { data: playlist, error: playlistError } = await supabase
            .from('playlists')
            .select('*')
            .eq('id', playlistId)
            .single();

        if (playlistError || !playlist) {
            console.error('Error fetching playlist:', playlistError);
            return null;
        }

        // Add default image if none exists
        playlist.image_path = playlist.image_path || DEFAULT_PLAYLIST_IMAGE;

        // Get songs from junction table with proper typing
        const { data: songData, error: songsError } = await supabase
            .from('playlist_songs')
            .select(`
                songs (
                    id,
                    user_id,
                    title,
                    author,
                    song_path,
                    image_path,
                    created_at
                )
            `)
            .eq('playlist_id', playlistId) as { data: SongRow[] | null, error: any };

        if (songsError || !songData) {
            console.error('Error fetching songs:', songsError);
            return null;
        }

        // Transform the data with improved null checking
        const songs: Song[] = songData
            .filter((item): item is { songs: NonNullable<SongRow['songs']> } => 
                item.songs !== null && item.songs !== undefined
            )
            .map(item => ({
                id: item.songs.id,
                user_id: item.songs.user_id,
                title: item.songs.title,
                author: item.songs.author,
                song_path: item.songs.song_path,
                image_path: item.songs.image_path,
                created_at: item.songs.created_at
            }));

        return {
            ...playlist,
            songs
        };

    } catch (error) {
        console.error('Error in getPlaylistById:', error);
        return null;
    }
};

export default getPlaylistById;