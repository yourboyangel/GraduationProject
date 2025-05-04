import { Suspense } from 'react';
import getSongsByTitle from "@/actions/getSongsByTitle";
import getRecentSearches from "@/actions/getRecentSearches";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import SearchLoading from "./components/loading";

interface SearchProps {
    searchParams: {
        title: string;
    }
};

export const revalidate = 0;

const Search = async ({ searchParams }: SearchProps) => {
    const songs = searchParams.title 
        ? await getSongsByTitle(searchParams.title)
        : await getRecentSearches();

    return(
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
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        {searchParams.title ? 'Search Results' : 'Recent Searches'}
                    </h1>
                    <SearchInput />
                </div>
            </Header>
            <Suspense fallback={<SearchLoading />}>
                <SearchContent songs={songs} />
            </Suspense>
        </div>
    )
};

export default Search;