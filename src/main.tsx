import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BookmarkletUI } from './components/BookmarkletUI';
import { CONTAINER_ID } from "./constants.ts";
import GlobalStyles from "./styles/GlobalStyles.tsx";
import type { MenuItem } from './types';


const initializeBookmarklet = (config?: {
	title?: string
	menuItems?: MenuItem[]
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
				menuItems={config?.menuItems ?? defaultMenuItems}
				onClose={() => {
					root.unmount();
					container.remove();
				}}
			/>
		</StrictMode>
	);
};

const defaultMenuItems: MenuItem[] = [
		{
			id: 'alert-test',
			label: '알럿 테스트',
			icon: '⚡',
			onClick: () => {
				alert('Bookmarklet이 정상적으로 작동합니다! 🎉');
			},
		},
		{
			id: 'copy-url',
			label: '현재 URL 복사',
			icon: '🔗',
			onClick: () => {
				navigator.clipboard.writeText(window.location.href);
				alert('URL이 복사되었습니다!');
			},
		},
		{
			id: 'dark-mode',
			label: '다크모드 토글',
			icon: '🌙',
			onClick: () => {
				document.body.style.filter =
					document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
			},
		},
	]

;(function () {
	initializeBookmarklet();
})();
