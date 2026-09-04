import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600",
  secondary: "bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:outline-zinc-900",
  outline: "border border-zinc-300 text-zinc-900 hover:bg-zinc-50 focus-visible:outline-zinc-400",
  ghost: "text-zinc-700 hover:bg-zinc-100 focus-visible:outline-zinc-400",
};

export function Button({
  variant = "primary",
  className,
  as: Component = "button",
  ...props
}: {
  variant?: ButtonVariant;
  as?: React.ElementType;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
