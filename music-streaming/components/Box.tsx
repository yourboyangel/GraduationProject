import { twMerge } from "tailwind-merge";

interface BoxProps {
    children: React.ReactNode;
    className?: string;
}

const Box: React.FC<BoxProps> = ({
    children,
    className
}) => {
    return (
        <div
        className={twMerge(`
        bg-[var(--gradient-surface)]
        rounded-lg
        h-fit
        w-full
        p-4
        shadow-lg
        hover:shadow-xl
        transition-all
        duration-200
        ease-in-out
        border border-white/5
        `, className)}>
            {children}
        </div>
    );
}

export default Box;