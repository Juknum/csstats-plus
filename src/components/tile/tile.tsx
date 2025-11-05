
import { type ReactNode } from 'react';
import '../common.css';
import './tile.css';

interface TileProps {
	content: ReactNode;
	className?: string;
	width?: number;
	height?: number;
	style?: React.CSSProperties;
	onClick?: () => void;
}

export default function Tile({ 
	content, 
	className,
	width,
	height,
	onClick,
	style,
}: TileProps) {

	return (
		<div 
			className={`tile ${className ?? ''}`} 
			style={{ ...style, width, height }}
			onClick={() => onClick?.()}
		>
			{content}
		</div>
	)

}