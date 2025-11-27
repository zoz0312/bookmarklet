import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BookmarkletUI } from './components/BookmarkletUI';
import { CONTAINER_ID } from "./constants.ts";
import { MENU_ITEMS } from "./scripts";
import GlobalStyles from "./styles/GlobalStyles.tsx";


const initializeBookmarklet = (config?: {
	title?: string
}) => {
	const existingContainer = document.getElementById(CONTAINER_ID);
	if (existingContainer) {
		existingContainer.remove();
		return;
	}

	const container = document.createElement('div');
	container.id = CONTAINER_ID;
	document.body.appendChild(container);

	const root = createRoot(container);
	root.render(
		<StrictMode>
			<GlobalStyles/>
			<BookmarkletUI
				title={config?.title}
				menuItems={MENU_ITEMS}
				onClose={() => {
					root.unmount();
					container.remove();
				}}
			/>
		</StrictMode>
	);
};

;(function () {
	initializeBookmarklet();
})();
