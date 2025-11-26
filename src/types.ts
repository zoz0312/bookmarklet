export interface Position {
	y: number;
}

export interface MenuItem {
	id: string;
	icon: string;
	label: string;
	onClick: () => void;
}

export interface BookmarkletConfig {
	title?: string;
	menuItems?: MenuItem[];
}