import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={clsx(
        "rounded-md font-medium transition-colors focus:outline-none",
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
        variant === "ghost" && "bg-transparent text-gray-700 hover:text-blue-600",
        size === "sm" && "px-2 py-1 text-sm",
        size === "md" && "px-4 py-2 text-md",
        size === "lg" && "px-6 py-3 text-lg",
        className
      )}
    >
      {children}
    </button>
  );
};
