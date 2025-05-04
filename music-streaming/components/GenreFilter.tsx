"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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

interface GenreFilterProps {
    currentGenres?: string;
    searchQuery?: string;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ 
    currentGenres = '',
    searchQuery = ''
}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(
        new Set(currentGenres ? currentGenres.split(',') : [])
    );

    const toggleGenre = (genre: string) => {
        const newSelected = new Set(selectedGenres);
        if (newSelected.has(genre)) {
            newSelected.delete(genre);
        } else {
            newSelected.add(genre);
        }
        setSelectedGenres(newSelected);

        const params = new URLSearchParams(searchParams.toString());
        if (newSelected.size > 0) {
            params.set('genres', Array.from(newSelected).join(','));
        } else {
            params.delete('genres');
        }
        
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {genres.map((genre) => (
                <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`
                        px-4 
                        py-2 
                        rounded-full 
                        text-sm
                        transition
                        duration-200
                        ${selectedGenres.has(genre)
                            ? 'bg-[#422B92] text-white shadow-lg' 
                            : 'bg-[#15132B] text-white hover:bg-[#2D2053]'
                        }
                    `}
                >
                    {genre}
                </button>
            ))}
        </div>
    );
};

export default GenreFilter;