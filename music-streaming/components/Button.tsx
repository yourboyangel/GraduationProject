import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'white' | 'outline' | 'signup' | 'login';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    children,
    disabled,
    type = "button",
    variant = 'default',
    ...props
}, ref) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'white':
                return 'bg-white text-black hover:bg-neutral-100 active:bg-neutral-200';
            case 'outline':
                return 'bg-transparent border border-white/10 text-white hover:border-white/20 hover:bg-white/5 active:bg-white/10';
            case 'signup':
                return 'bg-transparent border border-white/10 text-white hover:border-white/20 hover:bg-white/5 active:bg-white/10';
            case 'login':
                return 'bg-[var(--gradient-accent)] text-white hover:opacity-90 active:opacity-100 hover:scale-105 active:scale-95';
            default:
                return 'bg-[var(--gradient-accent)] text-white hover:opacity-90 active:opacity-100 hover:scale-105 active:scale-95';
        }
    };

    return (
        <button
            type={type}
            className={twMerge(`
                w-full
                rounded-full
                border
                border-transparent
                px-3
                py-2
                disabled:cursor-not-allowed
                disabled:opacity-50
                font-bold
                transition-all
                duration-200
                ease-in-out
                ${getVariantClasses()}
            `, className)}
            disabled={disabled}
            ref={ref}
            {...props}
        >
            {children}
        </button>
    )
})

Button.displayName = "Button";
export default Button;