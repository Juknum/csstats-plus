
import { type ReactNode } from 'react';
import '../common.css';
import './tile.css';

interface TileProps {
	content: ReactNode;
	className?: string;
	width?: number;
	height?: number;
	onClick?: () => void;
}

export default function Tile({ 
	content, 
	className,
	width,
	height,
	onClick,
}: TileProps) {

	return (
		<div 
			className={`tile ${className ?? ''}`} 
			style={{ width, height }}
			onClick={() => onClick?.()}
		>
			{content}
		</div>
	)

}