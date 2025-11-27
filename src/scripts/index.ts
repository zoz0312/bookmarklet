import type { MenuItem } from "../types.ts";
import { createJiraText } from "./createJiraText.ts";

export const MENU_ITEMS: MenuItem[] = [
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
	createJiraText,
];
