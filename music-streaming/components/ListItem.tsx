"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface ListItemProps {
    image: string;
    name: string;
    href: string;
    description?: string;
}

const ListItem: React.FC<ListItemProps> = ({
    image,
    name,
    href,
    description
}) => {
    const supabaseClient = useSupabaseClient();

    // Handle image URL
    const imageUrl = image.startsWith('/') 
        ? image // Local image from public directory
        : supabaseClient.storage
            .from('images')
            .getPublicUrl(image)
            .data.publicUrl;

    return (
        <Link
            href={href}
            className="
                relative
                group
                flex
                flex-col
                items-center
                justify-center
                rounded-xl
                overflow-hidden
                bg-[#1A1735]
                hover:bg-[#252242]
                transition
                p-4
                gap-x-4
            "
        >
            <div className="
                relative
                aspect-square
                w-full
                h-full
                rounded-lg
                overflow-hidden
            ">
                <Image
                    className="object-cover"
                    src={imageUrl}
                    fill
                    alt={name}
                />
            </div>
            <div className="flex flex-col items-start w-full pt-4">
                <p className="font-semibold truncate w-full text-white">
                    {name}
                </p>
                {description && (
                    <p className="text-neutral-400 text-sm pb-4 w-full truncate">
                        {description}
                    </p>
                )}
            </div>
        </Link>
    );
}

export default ListItem;