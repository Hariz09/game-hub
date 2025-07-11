// components/SidebarButton.tsx
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface SidebarButtonProps {
  onClick: () => void;
}

export default function SidebarButton({ onClick }: SidebarButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sidebar"
      className="fixed top-5 left-5 z-50 bg-white/70 backdrop-blur-md shadow-xl rounded-full hover:bg-white dark:bg-slate-800 dark:hover:bg-slate-700 transition"
      onClick={onClick}
    >
      <Menu className="text-gray-700 dark:text-gray-200 size-8"/>
    </Button>
  );
}