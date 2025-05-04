import { Suspense } from 'react';
import getSongsByTitle from "@/actions/getSongsByTitle";
import getRecentSearches from "@/actions/getRecentSearches";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import SearchLoading from "./components/loading";
import GenreFilter from '@/components/GenreFilter';

interface SearchProps {
    searchParams: {
        title?: string;
        genres?: string;
    }
}

export const revalidate = 0;

const Search = async ({ searchParams }: SearchProps) => {
    const title = await Promise.resolve(searchParams?.title || '');
    const genres = await Promise.resolve(searchParams?.genres || '');
    
    // Use different data source based on whether there's a search query
    const songs = title 
        ? await getSongsByTitle(title, genres)
        : await getRecentSearches();

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
            border-0
            outline-none
            focus:outline-none
            focus:ring-0
        ">
            <Header>
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        {title ? 'Search Results' : 'Recent Searches'}
                    </h1>
                    <SearchInput defaultValue={title} />
                    <GenreFilter 
                        currentGenres={genres}
                        searchQuery={title}
                    />
                </div>
            </Header>
            <Suspense fallback={<SearchLoading />}>
                <SearchContent songs={songs} />
            </Suspense>
        </div>
    );
};

export default Search;