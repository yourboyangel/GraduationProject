import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
    return (
        <div className="
            h-full
            w-full
            bg-gradient-to-b
            from-[#2D2053]
            to-[#15132B]
            rounded-lg
            overflow-hidden
        ">
            <LoadingSpinner />
        </div>
    );
}