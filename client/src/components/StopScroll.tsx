import React, { useEffect } from "react";

interface StopScrollProps {
	stop: boolean;
}

const StopScroll: React.FC<StopScrollProps> = ({ stop }) => {
	useEffect(() => {
		const handleBodyScroll = () => {
			if (stop) {
				document.body.style.overflow = "hidden";
			} else {
				document.body.style.overflow = "auto";
			}
		};

		handleBodyScroll();

		if (stop) {
			document.addEventListener("scroll", handleBodyScroll);
		}

		return () => {
			document.body.style.overflow = "auto";
			document.removeEventListener("scroll", handleBodyScroll);
		};
	}, [stop]);

	return null;
};

export default StopScroll;
