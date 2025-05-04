import getPlaylistById from "@/actions/getPlaylistById";
import Header from "@/components/Header";
import Image from "next/image";
import PlaylistContent from "./components/PlaylistContent";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import ShuffleButton from "@/components/ShuffleButton";

export const revalidate = 0;

interface PlaylistPageProps {
    params: {
        playlistId: string;
    }
}

const Playlist = async ({ params }: PlaylistPageProps) => {
    const supabase = createServerComponentClient({ cookies });
    const playlist = await getPlaylistById(params.playlistId);
    const songs = playlist?.songs || [];

    if (!playlist) {
        return (
            <div className="text-white p-8">Playlist not found.</div>
        );
    }

    // Get the public URL for the playlist image
    const imageUrl = playlist.image_path && !playlist.image_path.startsWith('/') 
        ? supabase.storage
            .from('images')
            .getPublicUrl(playlist.image_path)
            .data.publicUrl
        : playlist.image_path || "/images/default_playlist.png";

    return (
        <div className="
            bg-gradient-to-b
            from-[#2D2053]
            to-[#15132B]
            rounded-lg
            h-full
            w-full
            overflow-hidden
            overflow-y-auto
        ">
            <Header>
                <div className="mt-20">
                    <div className="
                        flex
                        flex-col
                        md:flex-row
                        items-center
                        gap-x-5
                    ">
                        <div className="
                            relative
                            h-32
                            w-32
                            lg:h-44
                            lg:w-44
                            min-w-[128px]
                            min-h-[128px]
                        ">
                            <Image
                                fill
                                alt={playlist.name || "Playlist"}
                                className="object-cover rounded-lg"
                                src={imageUrl}
                                priority
                            />
                        </div>
                        <div className="
                            flex
                            flex-col
                            gap-y-2
                            mt-4
                            md:mt-0
                        ">
                            <p className="hidden md:block font-semibold text-sm text-white">
                                Playlist
                            </p>
                            <h1 className="
                                text-white
                                text-4xl
                                sm:text-5xl
                                lg:text-7xl
                                font-bold
                                break-words
                                max-w-[800px]
                            ">
                                {playlist.name || "Untitled Playlist"}
                            </h1>
                        </div>
                    </div>
                    {songs.length > 0 && (
                        <div className="flex items-center gap-x-2 mt-4">
                            <ShuffleButton 
                                songs={songs}
                                className="ml-auto"
                            />
                        </div>
                    )}
                </div>
            </Header>
            <PlaylistContent songs={songs} />
        </div>
    );
}

export default Playlist;