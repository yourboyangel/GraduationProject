"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const ProfilePage = () => {
    const router = useRouter();
    const { user } = useUser();

    if (!user) {
        router.push('/');
        return null;
    }

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
                    <h1 className="text-white text-4xl font-bold">
                        Profile Settings
                    </h1>
                </div>
            </Header>
        </div>
    );
}

export default ProfilePage; 