
import { type ReactNode } from 'react';
import '../common.css';
import './tile.css';

interface TileProps {
	content: ReactNode;
	className?: string;
	isLoading?: boolean;
	width?: number;
	height?: number;
	style?: React.CSSProperties;
	onClick?: () => void;
}

export default function Tile({ 
	content, 
	className,
	isLoading = false,
	width,
	height,
	onClick,
	style,
}: TileProps) {

	if (isLoading) return (
		<div
			className={`tile tile-loading ${className ?? ''}`}
			style={{ ...style, width, height }}
			onClick={() => onClick?.()}
		/>
	)

	return (
		<div 
			className={`tile ${className ?? ''}`} 
			style={{ ...style, width, height }}
			onClick={() => onClick?.()}
		>
			{content}
		</div>
	);

}