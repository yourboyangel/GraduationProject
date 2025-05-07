"use client";
import { useRouter } from "next/navigation";
import { BiSearch } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { twMerge } from "tailwind-merge";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import usePlayer from "@/hooks/usePlayer";
import { Link } from "react-router-dom";

interface HeaderProps {
    children: React.ReactNode;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    children, 
    className
}) => {
    const authModal = useAuthModal();
    const router = useRouter();
    const supabaseClient = useSupabaseClient();
    const { user, isLoading } = useUser();
    const [isMounted, setIsMounted] = useState(false);
    const player = usePlayer();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleBack = () => {
        router.back();
    };

    const handleForward = () => {
        router.forward();
    };

    const handleLogout = async () => { 
        const { error } = await supabaseClient.auth.signOut();
        player.reset(); // Reset player state on logout
        router.refresh();

        if(error){
            toast.error(error.message);
        }
        else{
            toast.success('Logged Out!');
            router.push('/'); // Redirect to homepage after successful logout
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        
        <div
        className={twMerge(`
            h-fit
            bg-gradient-to-b
            from-[#2D2053]/50
            p-6
            `, className)}
        >
            <div className="
            w-full
            mb-4
            flex
            items-center
            justify-between
            ">
                <div className="
                hidden
                md:flex
                gap-x-2
                items-center
                ">
                    <button
                    onClick={handleBack}
                    className="
                    rounded-full
                    bg-[#15132B]
                    p-2
                    flex
                    items-center
                    justify-center
                    hover:opacity-75
                    transition
                    ">
                        <RxCaretLeft className="text-white" size={35} />
                    </button>

                    <button
                    onClick={handleForward}
                    className="
                    rounded-full
                    bg-[#15132B]
                    p-2
                    flex
                    items-center
                    justify-center
                    hover:opacity-75
                    transition
                    ">
                        <RxCaretRight className="text-white" size={35} />
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button
                    className="
                    rounded-full
                    p-2
                    bg-white
                    items-center
                    justify-center
                    hover:opacity-75
                    transition
                    ">
                        <HiHome className="text-black" size={20} />
                    </button>

                    <button
                    className="
                    rounded-full
                    p-2
                    bg-white
                    items-center
                    justify-center
                    hover:opacity-75
                    transition
                    ">
                        <BiSearch className="text-black" size={20} />
                    </button>
                </div>

                <div
                className="
                flex
                justify-between
                items-center
                gap-x-4
                ">
                    {!isLoading && (
                        user ? (
                            <div className="flex gap-x-4 items-center">
                                <Button 
                                    onClick={handleLogout} 
                                    variant="login" 
                                    className="px-6 py-2"
                                >
                                    Logout
                                </Button>
                                <Button 
                                    onClick={() => router.push('/account')} 
                                    variant="default"
                                    className="p-2"
                                >
                                    <FaUserAlt />
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <Button
                                        onClick={authModal.onOpen}
                                        variant="login"
                                        className="px-6 py-2"
                                    >
                                        Sign Up
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        onClick={authModal.onOpen}
                                        variant="login"
                                        className="px-6 py-2"
                                    >
                                        Log In
                                    </Button>
                                </div>
                            </>
                        )
                    )}
                </div>
            </div>
            {children}
        </div>
    );
}

export default Header;