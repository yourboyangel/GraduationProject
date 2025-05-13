"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useRef, useState } from "react";

const ProfilePage = () => {
    const router = useRouter();
    const { user } = useUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    if (!user) {
        router.push('/');
        return null;
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                alert("Failed to process file.");
                setLoading(false);
                return;
            }

            // Download the cleaned file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "cleaned_" + file.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("An error occurred: " + error);
        } finally {
            setLoading(false);
        }
    };

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
                        Special Features
                    </h1>
                </div>
            </Header>
            <div className="px-6 py-4">
                <input
                    type="file"
                    accept="audio/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <button 
                    className="
                        bg-purple-600 
                        text-white 
                        px-4 
                        py-2 
                        rounded-md 
                        font-medium 
                        hover:bg-purple-700 
                        transition
                        cursor-pointer
                    "
                    onClick={handleButtonClick}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Filter Explicit Content"}
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;