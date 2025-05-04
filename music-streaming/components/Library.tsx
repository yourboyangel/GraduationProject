"use client";

import useAuthModal from "@/hooks/useAuthModal";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";
import { Playlist } from "@/types";
import { AiOutlinePlus } from "react-icons/ai";
import { TbPlaylist } from "react-icons/tb";
import { MdPlaylistAdd } from "react-icons/md";
import PlaylistItem from "./PlaylistItem";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";
import { useRouter } from "next/navigation";

interface LibraryProps {
    playlists: Playlist[];
}

const Library: React.FC<LibraryProps> = ({ playlists }) => {
    const authModal = useAuthModal();
    const uploadModal = useUploadModal();
    const createPlaylistModal = useCreatePlaylistModal();
    const { user } = useUser();
    const router = useRouter();

    const onClick = () => {
        if (!user) {
            return authModal.onOpen();
        }

        return uploadModal.onOpen();
    };

    const onCreatePlaylist = () => {
        if (!user) {
            return authModal.onOpen();
        }

        return createPlaylistModal.onOpen();
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist className="text-neutral-400" size={26} />
                    <p className="text-neutral-400 font-medium text-md">
                        Your Library
                    </p>
                </div>
                <div className="flex items-center gap-x-2">
                    <AiOutlinePlus
                        onClick={onClick}
                        size={20}
                        className="
                            text-neutral-400 
                            cursor-pointer 
                            hover:text-white 
                            transition
                            transform
                            hover:rotate-90
                        "
                    />
                    <MdPlaylistAdd
                        onClick={onCreatePlaylist}
                        size={25}
                        className="
                            text-neutral-400 
                            cursor-pointer 
                            hover:text-white 
                            transition
                            transform
                            hover:scale-110
                        "
                    />
                </div>
            </div>
            <div className="
                flex
                flex-col
                gap-y-2
                mt-4
                px-3
            ">
                {playlists.map((item) => (
                    <PlaylistItem
                        key={item.id}
                        data={item}
                        onClick={() => router.push(`/playlist/${item.id}`)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Library;