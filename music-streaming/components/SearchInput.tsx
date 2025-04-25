"use client";

import qs from "query-string";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Input from "./Input";

const SearchInput = () => {
    const router = useRouter();
    const [value, setValue] = useState<string>("");
    const debouncedValue = useDebounce<string>(value, 500);

    useEffect(() => {
        // Don't navigate if the search term is empty (initial render)
        if (!debouncedValue) return;
        
        const query = {
            title: debouncedValue,
        };

        const url = qs.stringifyUrl({
            url: '/search',
            query
        });
        
        // Use a small timeout to ensure router is mounted
        const timeoutId = setTimeout(() => {
            router.push(url);
        }, 0);
        
        return () => clearTimeout(timeoutId);
    }, [debouncedValue, router]);

    return (
        <Input 
            placeholder="What do you want to listen to?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}

export default SearchInput;