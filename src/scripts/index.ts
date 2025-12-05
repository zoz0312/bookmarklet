import type { MenuItem } from "../types.ts";
import { createJiraDaily } from './createJiraDaily';
import { createJiraWeekly } from "./createJiraWeekly.ts";

export const MENU_ITEMS: MenuItem[] = [
	createJiraWeekly,
  createJiraDaily,
];
