"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import Input from "./Input";

interface SearchInputProps {
    defaultValue?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ defaultValue = '' }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [value, setValue] = useState(defaultValue);
    const debouncedValue = useDebounce<string>(value, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (debouncedValue) {
            params.set('title', debouncedValue);
        } else {
            params.delete('title');
        }
        
        router.push(`/search?${params.toString()}`);
    }, [debouncedValue, router, searchParams]);

    return (
        <Input 
            placeholder="What do you want to listen to?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-[#15132B] border-[#2D2053] focus:border-purple-500 text-white"
        />
    );
};

export default SearchInput;