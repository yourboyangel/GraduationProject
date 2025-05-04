"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import useDebounce from "@/hooks/useDebounce";
import { useUser } from "@/hooks/useUser";
import Input from "./Input";

const SearchInput = () => {
    const router = useRouter();
    const [value, setValue] = useState<string>("");
    const debouncedValue = useDebounce<string>(value, 500);
    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    useEffect(() => {
        router.push(`/search?title=${debouncedValue}`);
    }, [debouncedValue, router]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <Input 
            placeholder="What do you want to listen to?"
            value={value}
            onChange={onChange}
        />
    );
};

export default SearchInput;