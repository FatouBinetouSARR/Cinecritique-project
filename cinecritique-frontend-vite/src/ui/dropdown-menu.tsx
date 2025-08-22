import type { ReactNode } from "react";

interface DropdownMenuProps {
  children: ReactNode;
}
export const DropdownMenu = ({ children }: DropdownMenuProps) => <div className="relative">{children}</div>;

export const DropdownMenuTrigger = ({ children, asChild = false, as }: { children: ReactNode; asChild?: boolean; as?: React.ElementType }) => {
  if (asChild && as) {
    const Component = as;
    return <Component>{children}</Component>;
  }
  return <>{children}</>;
};

export const DropdownMenuContent = ({
  children,
  align = "end",
}: {
  children: ReactNode;
  align?: "start" | "end";
}) => (
  <div
    className={`absolute top-full mt-2 min-w-[180px] rounded-lg border border-primary bg-black shadow-lg z-50 ${
      align === "end" ? "right-0" : "left-0"
    }`}
  >
    {children}
  </div>
);

export const DropdownMenuItem = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className="px-4 py-2 text-sm text-white hover:bg-primary cursor-pointer flex items-center gap-2"
  >
    {children}
  </div>
);

export const DropdownMenuSeparator = () => <div className="border-t border-primary my-1" />;
