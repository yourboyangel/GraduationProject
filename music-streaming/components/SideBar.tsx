"use client";

import {usePathname} from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { BsMoonStars } from "react-icons/bs";
import Box from "./Box";
import SidebarItem from "./SidebarItem";
import Library from "./Library";
import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";
import { twMerge } from "tailwind-merge";
import { Playlist } from "@/types";
import PlaylistItem from "./PlaylistItem";

interface SidebarProps {
    children: React.ReactNode;
    songs: Song[];
    playlists: Playlist[];
}

const Sidebar: React.FC<SidebarProps> = ({
    children,
    songs,
    playlists
}) => {
    const pathname = usePathname();
    const player = usePlayer();

    const routes = useMemo(() => [
        {
            icon: HiHome,
            label: 'Home',
            active: pathname !== '/search',
            href: '/',
        },
        {
            icon: BiSearch,
            label: 'Search',
            active: pathname === '/search',
            href: '/search',
        }
    ], [pathname]);
    return (
        <div className={twMerge(`
            flex 
            h-full
        `,
        player.activeId && "h-[calc(100%-80px)]"
        )}>
            <div
            className="
            hidden
            md:flex
            flex-col
            gap-y-2
            bg-[#15132B]
            h-full
            w-[300px]
            p-2
            ">
                <div className="flex items-center gap-x-4 px-5 py-4 group cursor-pointer">
                    <BsMoonStars 
                        size={34} 
                        className="
                            text-[#422B92] 
                            transition 
                            duration-300 
                            group-hover:text-[#5A4F9B] 
                            group-hover:rotate-12
                        " 
                    />
                    <span className="
                        text-2xl 
                        font-bold 
                        bg-gradient-to-r 
                        from-[#422B92] 
                        to-[#5A4F9B] 
                        text-transparent 
                        bg-clip-text
                        transition
                        duration-300
                        group-hover:from-[#5A4F9B]
                        group-hover:to-[#422B92]
                    ">
                        Lunatone
                    </span>
                </div>
                <Box>
                    <div
                    className="
                    flex
                    flex-col
                    gap-y-4
                    px-5
                    py-4
                    ">
                        {routes.map((item)=>(
                            <SidebarItem 
                            key={item.label}
                            {...item}
                            />
                        ))}
                    </div>
                </Box>
                <Box className="overflow-y-auto h-full">
                    <Library playlists={playlists} />
                </Box>
            </div>
            <main className="h-full flex-1 overflow-y-auto py-2">
                {children}
            </main>
        </div>
    )
}

export default Sidebar;