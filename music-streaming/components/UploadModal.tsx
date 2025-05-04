"use client";

import useUploadModal from "@/hooks/useUploadModal";
import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

const genres = [
    'Pop',
    'Rock',
    'Hip Hop',
    'R&B',
    'Electronic',
    'Jazz',
    'Classical',
    'Metal',
    'Country',
    'Blues',
    'Folk',
    'Indie',
    'Alternative',
    'Dance',
    'Reggae'
] as const;

const UploadModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const uploadModal = useUploadModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    

    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            author: "",
            title: "",
            song: null,
            image: null,
            genre: "Pop" // Default genre
        }
    })

    const onChange = (open: boolean) => {
        if(!open){
            reset();
            uploadModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const songFile = values.song?.[0];

            if (!songFile || !user) {
                toast.error("Missing song file");
                return;
            }

            const uniqueID = uniqid();

            // Upload song
            const {
                data: songData,
                error: songError,
            } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (songError) {
                setIsLoading(false);
                return toast.error('Failed song upload.');
            }

            // Get the URL for the default image from public storage
            const {
                data: { publicUrl: defaultImageUrl }
            } = supabaseClient
                .storage
                .from('images')
                .getPublicUrl('default_song.png');

            let imagePath = 'default_song.png'; // Default to the base filename

            // Only upload image if user selected one
            if (imageFile) {
                const {
                    data: imageData,
                    error: imageError,
                } = await supabaseClient
                    .storage
                    .from('images')
                    .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (imageError) {
                    setIsLoading(false);
                    return toast.error('Failed image upload.');
                }

                imagePath = imageData.path;
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from('songs')
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imagePath,
                    song_path: songData.path,
                    genre: values.genre // Add genre to the insert
                });

            if (supabaseError) {
                setIsLoading(false);
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success('Song created!');
            reset();
            uploadModal.onClose();

        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal 
        title="Add a song"
        description="Upload an mp3 file"
        isOpen={uploadModal.isOpen}
        onChange={onChange}>
            <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-4"
            >
                <Input 
                id="title"
                disabled={isLoading}
                {...register('title',{required: true})}
                placeholder="Song Title"
                className="bg-[#15132B] border-[#2D2053] focus:border-purple-500 text-white"
                />

                <Input 
                id="author"
                disabled={isLoading}
                {...register('author',{required: true})}
                placeholder="Song Author"
                className="bg-[#15132B] border-[#2D2053] focus:border-purple-500 text-white"
                />
                <div>
                    <div className="pb-1 text-white">
                        Select Genre
                    </div>
                    <select
                        {...register('genre', { required: true })}
                        className="
                            w-full
                            rounded-md
                            bg-[#15132B]
                            border
                            border-[#2D2053]
                            p-3
                            text-white
                            focus:outline-none
                            focus:border-purple-500
                        "
                    >
                        {genres.map((genre) => (
                            <option 
                                key={genre} 
                                value={genre}
                                className="bg-[#15132B]"
                            >
                                {genre}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <div className="pb-1 text-white">
                        Select a Song File
                    </div>
                    <Input 
                id="song"
                type="file"
                disabled={isLoading}
                accept=".mp3"
                {...register('song',{required: true})}
                className="bg-[#15132B] border-[#2D2053] focus:border-purple-500 text-white"
                />
                </div>
                <div>
                    <div className="pb-1 text-white">
                        Select an Image (Optional)
                    </div>
                    <Input 
                id="image"
                type="file"
                disabled={isLoading}
                accept="image/*"
                {...register('image')} // Removed required validation
                className="bg-[#15132B] border-[#2D2053] focus:border-purple-500 text-white"
                />
                </div>
                <Button 
                disabled={isLoading} 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700"
                >
                    Create
                </Button>
            </form>

        </Modal>
    );
}
export default UploadModal;