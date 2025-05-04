import Box from "@/components/Box";

const SearchLoading = () => {
    return (
        <Box className="h-full flex items-center justify-center">
            <div className="
                w-6
                h-6
                border-2
                border-[#422B92]
                border-t-transparent
                rounded-full
                animate-spin
            "/>
        </Box>
    );
};

export default SearchLoading;