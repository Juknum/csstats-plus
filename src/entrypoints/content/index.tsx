import { createRoot } from "react-dom/client";
import App from "./App";

export default defineContentScript({
  matches: ['*://csstats.gg/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'css-stats-plus',
      position: 'inline',
      anchor: 'body',
      append: (anchor, container) => {
        anchor.insertBefore(container, anchor.children[1]);
      },
      onMount: (container) => {
        const app = document.createElement('div');
        container.append(app);

        const root = createRoot(container);
        root.render(<App />);

        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      }
    });

    ui.mount();

    
  },
});
