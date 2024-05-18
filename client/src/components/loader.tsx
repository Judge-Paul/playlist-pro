import { cn } from "@/lib/utils";

export default function Loader({ className }: { className?: string }) {
  return (
    <div className={cn("h-4 w-4 animate-pulse bg-secondary", className)}></div>
  );
}
