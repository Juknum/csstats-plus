import { useEffect, useState } from "react";
import { usePlayerData } from "@/hooks/usePlayerData";
import type { Stats } from "@/utils/types";

interface DelatIndicatorProps {
	deltaKey: keyof Stats["overall"]["delta"];
	className?: string;
	style?: React.CSSProperties;
	showZero?: false;
}

export default function DeltaIndicator({ deltaKey, className, style, showZero }: DelatIndicatorProps) {
	const {
		user: { stats },
		loading,
	} = usePlayerData();

	const [delta, setDelta] = useState(0);
	const [deltaStatus, setDeltaStatus] = useState<"up" | "same" | "down">("same");

	useEffect(() => {
		if (loading || !stats) return;

		setDelta(Math.abs(stats?.overall?.delta[deltaKey] ?? 0));
		setDeltaStatus((stats?.overall?.delta[deltaKey] ?? 0) > 0 ? "up" : (stats?.overall?.delta[deltaKey] ?? 0) < 0 ? "down" : "same");
	}, [loading, stats, deltaKey]);

	return (
		<div className={`row text relative ${className}`} style={style}>
			{deltaStatus === "up" && (
				<span
					style={{
						fontFamily: "Roboto",
						position: "absolute",
						top: "2px",
						left: "-15px",
					}}
				>
					⌃
				</span>
			)}
			{showZero !== false && deltaStatus === "same" && <span className="text-light">No variation</span>}
			{deltaStatus === "down" && (
				<span
					style={{
						fontFamily: "Roboto",
						fontSize: "1.1rem",
						position: "absolute",
						top: "-5px",
						left: "-15px",
					}}
				>
					⌄
				</span>
			)}
			{delta !== 0 && <span>{delta}</span>}
		</div>
	);
}
