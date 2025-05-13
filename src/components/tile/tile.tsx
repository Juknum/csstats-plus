
import { type ReactNode } from 'react';
import '../common.css';
import './tile.css';

interface TileProps {
	title: ReactNode;
	content: ReactNode;

	className?: string;
	titleClassName?: string;
	contentClassName?: string;
}

export default function Tile({ 
	title, 
	content, 
	className,
	titleClassName,
	contentClassName,
}: TileProps) {

	return (
		<div className={`col tile ${className ?? ''}`}>
			<div className={`full-width ${titleClassName ?? ''}`}>{title}</div>
			<div className={`full-width ${contentClassName ?? ''}`}>{content}</div>
		</div>
	)

}