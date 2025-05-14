"use client";

import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useState, useRef } from "react";

const ProfilePage = () => {
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [shazamLoading, setShazamLoading] = useState(false);
    const [shazamResult, setShazamResult] = useState<string | null>(null);
    const [recording, setRecording] = useState(false);
    const [songInfo, setSongInfo] = useState<any>(null);
    let mediaRecorder: MediaRecorder | null = null;
    let audioChunks: Blob[] = [];
    const fileInputRef = useRef<HTMLInputElement>(null);

    console.log("AUDD TOKEN:", process.env.NEXT_PUBLIC_AUDD_API_TOKEN);

    if (!user) {
        router.push('/');
        return null;
    }

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

    const startRecording = async () => {
        console.log("Starting recording...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Got media stream:", stream);
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                console.log("Data available:", event.data);
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                console.log("Recording stopped, processing audio...");
                const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
                console.log("Audio blob created:", audioBlob);
                await identifySong(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            console.log("MediaRecorder started");
            setRecording(true);
            setShazamLoading(true);

            // Stop recording after 10 seconds
            setTimeout(() => {
                if (mediaRecorder && mediaRecorder.state === "recording") {
                    console.log("Stopping recording after timeout");
                    mediaRecorder.stop();
                    setRecording(false);
                }
            }, 10000);
        } catch (error) {
            console.error("Error in startRecording:", error);
            alert("Failed to access microphone: " + error);
            setShazamLoading(false);
            setRecording(false);
        }
    };

    const identifySong = async (audioBlob: Blob) => {
        setShazamLoading(true);
        setSongInfo(null);
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.mp3");
        formData.append("api_token", "26d41b598cde9611d80d021935d823c0");

        try {
            const response = await fetch("https://api.audd.io/", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            console.log("AudD API response:", data);
            if (data.result) {
                setShazamResult(`${data.result.title} by ${data.result.artist}`);
                setSongInfo(data.result);
            } else {
                setShazamResult("Song not recognized. Please try again with clearer audio.");
            }
        } catch (error) {
            console.error("AudD error:", error);
            setShazamResult("Error recognizing song. Please try again.");
            alert("An error occurred: " + error);
        } finally {
            setShazamLoading(false);
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
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium hover:bg-purple-700 transition cursor-pointer"
                >
                    {loading ? "Processing..." : "Filter Explicit Content"}
                </button>

                <button
                    className="
                        mt-4
                        flex
                        items-center
                        bg-purple-500
                        text-white
                        px-4
                        py-2
                        rounded-md
                        font-medium
                        hover:bg-purple-600
                        transition
                        cursor-pointer
                    "
                    onClick={startRecording}
                    disabled={shazamLoading}
                >
                    <img src="/images/shazam.svg" alt="Shazam Logo" className="w-6 h-6 mr-2" />
                    {recording ? "Listening..." : shazamLoading ? "Recognizing..." : "Music Recognition"}
                </button>

                {shazamResult && (
                    <div className="mt-4">
                        <div className="bg-[#221a3a] rounded-lg p-6 shadow-lg flex flex-col items-start max-w-md">
                            <h2 className="text-2xl font-bold text-purple-300 mb-2">{songInfo?.title || "Unknown Title"}</h2>
                            <h3 className="text-lg text-purple-200 mb-2">{songInfo?.artist || "Unknown Artist"}</h3>
                            {songInfo?.album && (
                                <p className="text-white mb-1"><span className="font-semibold">Album:</span> {songInfo.album}</p>
                            )}
                            {songInfo?.release_date && (
                                <p className="text-white mb-1"><span className="font-semibold">Release Date:</span> {songInfo.release_date}</p>
                            )}
                            {songInfo?.label && (
                                <p className="text-white mb-1"><span className="font-semibold">Label:</span> {songInfo.label}</p>
                            )}
                            {songInfo?.spotify && songInfo.spotify.external_urls?.spotify && (
                                <a href={songInfo.spotify.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline mb-1">Listen on Spotify</a>
                            )}
                            {songInfo?.apple_music && songInfo.apple_music.url && (
                                <a href={songInfo.apple_music.url} target="_blank" rel="noopener noreferrer" className="text-pink-400 underline mb-1">Listen on Apple Music</a>
                            )}
                            {songInfo?.song_link && (
                                <a href={songInfo.song_link} target="_blank" rel="noopener noreferrer" className="text-green-400 underline mb-1">More Info</a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;