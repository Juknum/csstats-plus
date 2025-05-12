import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';

const containerId = 'css-stats-plus';

let container = document.getElementById(containerId);
if (!container) {
	container = document.createElement('div');
	container.id = containerId;
	container.style.position = 'fixed';
	container.style.top = '0';
	container.style.right = '0';
	container.style.zIndex = '9999';
	document.body.appendChild(container);
}

const root = createRoot(container);
root.render(<App />);