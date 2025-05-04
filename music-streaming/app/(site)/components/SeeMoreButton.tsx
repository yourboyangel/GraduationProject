"use client";

import { FiChevronDown } from "react-icons/fi";

interface SeeMoreButtonProps {
    onLoadMore: () => void;
    isLoading?: boolean;
}

const SeeMoreButton: React.FC<SeeMoreButtonProps> = ({
    onLoadMore,
    isLoading = false
}) => {
    return (
        <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="
                flex
                items-center
                gap-x-2
                text-neutral-400
                hover:text-white
                transition
                group
                disabled:opacity-50
                py-2
                px-4
                rounded-full
                bg-[#15132B]
                hover:bg-[#2D2053]
            "
        >
            <span className="text-sm">
                {isLoading ? 'Loading...' : 'Show More'}
            </span>
            <FiChevronDown
                className={`
                    transition
                    ${!isLoading && 'group-hover:translate-y-1'}
                `}
                size={20}
            />
        </button>
    );
};

export default SeeMoreButton;