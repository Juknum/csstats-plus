import { useState, type ComponentPropsWithoutRef } from "react";

const FALLBACKS = (src: string) => [
	`https://raw.githubusercontent.com/Juknum/counter-strike-icons/main/cs2/panorama/images/map_icons/map_icon_${src}.svg`,
	`https://raw.githubusercontent.com/Juknum/counter-strike-icons/main/csgo/materials/panorama/images/map_icons/map_icon_${src}.svg`,
	`https://static.csstats.gg/images/maps/icons/${src}.png`,
];

type MapIconProps = ComponentPropsWithoutRef<"img"> & {
	src: string;
	alt: string;
};

export function MapIcon({ src, alt, ...props }: MapIconProps) {
	const sources = FALLBACKS(src);
	const [index, setIndex] = useState(0);

	return (
		<img
			{...props}
			alt={alt}
			src={sources[index]}
			onError={() => {
				console.warn(`Failed to load map icon for ${src} from ${sources[index]}`);
				if (index < sources.length - 1) setIndex((i) => i + 1);
			}}
		/>
	);
}
