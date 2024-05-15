import { Sun, Monitor, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

export default function Toggle() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="mt-4 flex w-max gap-1 rounded-full border-2 border-secondary px-4 py-2.5">
			<Sun
				className={cn(
					"h-8 w-8 rounded-full p-1.5 hover:bg-secondary",
					theme === "light" && "bg-secondary",
				)}
				onClick={() => setTheme("light")}
			/>
			<Monitor
				className={cn(
					"h-8 w-8 rounded-full p-1.5 hover:bg-secondary",
					theme === "system" && "bg-secondary",
				)}
				onClick={() => setTheme("system")}
			/>
			<Moon
				className={cn(
					"h-8 w-8 rounded-full p-1.5 hover:bg-secondary",
					theme === "dark" && "bg-secondary",
				)}
				onClick={() => setTheme("dark")}
			/>
		</div>
	);
}
