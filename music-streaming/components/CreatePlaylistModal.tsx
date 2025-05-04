"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import uniqid from "uniqid";
import { useRouter } from "next/navigation";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import useCreatePlaylistModal from "@/hooks/useCreatePlaylistModal";

const CreatePlaylistModal = () => {
    const [isLoading, setIsLoading] = useState(false);
    const createPlaylistModal = useCreatePlaylistModal();
    const { user } = useUser();
    const supabaseClient = useSupabaseClient();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            description: '',
            image: null,
        }
    });

    const onChange = (open: boolean) => {
        if (!open) {
            reset();
            createPlaylistModal.onClose();
        }
    }

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {
        try {
            setIsLoading(true);

            const imageFile = values.image?.[0];
            const uniqueID = uniqid();

            if (!user) {
                toast.error("Must be logged in");
                return;
            }

            // Update default image path
            let imagePath = '/images/playlist.png';

            if (imageFile) {
                const {
                    data: imageData,
                    error: imageError
                } = await supabaseClient
                    .storage
                    .from('images')
                    .upload(`playlist-image-${uniqueID}`, imageFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (imageError) {
                    setIsLoading(false);
                    return toast.error('Failed image upload');
                }

                imagePath = imageData.path;
            }

            const {
                error: supabaseError
            } = await supabaseClient
                .from('playlists')
                .insert({
                    user_id: user.id,
                    name: values.name,
                    description: values.description || null,
                    image_path: imagePath
                });

            if (supabaseError) {
                return toast.error(supabaseError.message);
            }

            router.refresh();
            setIsLoading(false);
            toast.success('Playlist created!');
            reset();
            createPlaylistModal.onClose();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title="Create a new playlist"
            description="Add a new playlist to your library"
            isOpen={createPlaylistModal.isOpen}
            onChange={onChange}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-y-4"
            >
                <Input
                    id="name"
                    disabled={isLoading}
                    {...register('name', { required: true })}
                    placeholder="Playlist name"
                    className="bg-[#15132B] border-[#2D2053] focus:border-purple-500 text-white"
                />
                <Input
                    id="description"
                    disabled={isLoading}
                    {...register('description')}
                    placeholder="Description (optional)"
                    className="bg-[#15132B] border-[#2D2053] focus:border-purple-500 text-white"
                />
                <div>
                    <div className="pb-1 text-white">
                        Select an image (optional)
                    </div>
                    <Input
                        id="image"
                        type="file"
                        disabled={isLoading}
                        accept="image/*"
                        {...register('image')}
                        className="bg-[#15132B] border-[#2D2053] focus:border-purple-500 text-white"
                    />
                </div>
                <Button 
                    disabled={isLoading} 
                    type="submit"
                    className="bg-[#422B92] hover:bg-[#5A4F9B]"
                >
                    Create
                </Button>
            </form>
        </Modal>
    );
}

export default CreatePlaylistModal;