import { createRoot } from "react-dom/client";
import { createShadowRootUi, defineContentScript } from "#imports";

import App from "./App";

export default defineContentScript({
	matches: ["*://csstats.gg/*"],
	cssInjectionMode: "ui",

	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: "css-stats-plus",
			position: "inline",
			anchor: () => document.getElementById("header-nav-outer"),
			append: "after",
			onMount: (container) => {
				const app = document.createElement("div");
				container.append(app);

				const root = createRoot(container);
				root.render(<App />);

				return root;
			},
			onRemove: (root) => {
				root?.unmount();
			},
		});

		ui.mount();
	},
});
