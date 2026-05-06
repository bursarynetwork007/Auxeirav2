import { forwardRef } from "react";
import Link from "next/link";

type Variant = "gold-filled" | "gold-outline" | "dark-filled";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  "gold-filled":
    "bg-[#C9A84C] text-[#0A1628] hover:bg-[#b8963e] font-medium tracking-wide",
  "gold-outline":
    "border border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A1628] font-medium tracking-wide",
  "dark-filled":
    "bg-[#0A1628] text-[#F5F0E8] hover:bg-[#0f1f3d] font-medium tracking-wide",
};

const base =
  "inline-flex items-center justify-center px-6 py-3 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] focus-visible:ring-offset-2";

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "gold-filled", href, external, children, className = "", ...props }, ref) => {
    const classes = `${base} ${variantClasses[variant]} ${className}`;

    if (href) {
      if (external) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
