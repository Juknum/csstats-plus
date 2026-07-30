import type { ReactNode } from "react";
import "../common.css";

interface TileProps {
	content: ReactNode;
	className?: string;
	isLoading?: boolean;
	width?: number;
	height?: number;
	style?: React.CSSProperties;
	onClick?: () => void;
}

const TILE_BASE = "tile bg-[rgba(11,13,24,0.6)] backdrop-blur-md rounded-[3px] p-[10px] flex relative border border-white/[0.04] max-w-full box-border";

export default function Tile({ content, className, isLoading = false, width, height, onClick, style }: TileProps) {
	if (isLoading) {
		if (onClick) {
			return (
				<button
					type="button"
					className={`${TILE_BASE} tile-loading cursor-pointer ${className ?? ""}`}
					style={{ ...style, width, height }}
					onClick={() => onClick?.()}
				/>
			);
		}

		return <div className={`${TILE_BASE} tile-loading ${className ?? ""}`} style={{ ...style, width, height }} />;
	}

	if (onClick) {
		return (
			<button
				type="button"
				className={`${TILE_BASE} cursor-pointer ${className ?? ""}`}
				style={{ ...style, width, height }}
				onClick={() => onClick?.()}
			>
				{content}
			</button>
		);
	}

	return (
		<div className={`${TILE_BASE} ${className ?? ""}`} style={{ ...style, width, height }}>
			{content}
		</div>
	);
}
