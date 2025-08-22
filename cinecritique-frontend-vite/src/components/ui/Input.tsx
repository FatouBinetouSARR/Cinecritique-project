import clsx from "clsx";

// No need for a separate interface, use the type directly
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={clsx(
        "border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
    />
  );
};
