import type { MenuItem } from "../types.ts";

type StatusGroupKey = 'done' | 'qa' | 'review' | 'progress' | 'backlog' | 'others';


export const createJiraText: MenuItem = {
	id: 'jira',
	label: '모든 업무 JQL 지라 복사',
	icon: '👐',
	onClick: handleJiraExportClick
};

type JiraIssue = {
	key: string;
	summary: string;
	status: string;
};

function collectIssueRows(): HTMLTableRowElement[] {
	const nodeList = document.querySelectorAll<HTMLTableRowElement>(
		'tr[data-testid="native-issue-table.ui.issue-row"]'
	);
	return Array.from(nodeList);
}

function createIssueFromRow(row: HTMLTableRowElement): JiraIssue | null {
	const key = extractIssueKey(row);
	const summary = extractIssueSummary(row);
	const status = extractIssueStatus(row);

	if (!key || !summary || !status) return null;
	return {key, summary, status};
}

function extractIssueKey(row: HTMLTableRowElement): string | null {
	const keyAnchor = row.querySelector<HTMLAnchorElement>(
		'[data-testid="native-issue-table.common.ui.issue-cells.issue-key.issue-key-cell"]'
	);
	return keyAnchor?.textContent?.trim() ?? null;
}

function extractIssueSummary(row: HTMLTableRowElement): string | null {
	const summarySpan = row.querySelector<HTMLSpanElement>(
		'[data-testid="native-issue-table.common.ui.issue-cells.issue-summary.issue-summary-cell"]'
	);
	return summarySpan?.textContent?.trim() ?? null;
}

function extractIssueStatus(row: HTMLTableRowElement): string | null {
	const statusButton = row.querySelector('[data-vc="native-issue-table-ui-issue-status-box"] button[aria-label]');
	if (!statusButton) return null;

	const ariaLabel = statusButton.getAttribute('aria-label');
	return ariaLabel?.split(' - ')[0] ?? null;
}

function copyToClipboard(text: string) {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text).catch(() => {
		});
	} else {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.left = '-9999px';
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
	}
}

const STATUS_GROUPS: { key: StatusGroupKey; label: string; statuses: string[] }[] = [
	{key: 'done', label: '배포 완료', statuses: ['Deployed', 'Ready to Deploy']},
	{key: 'qa', label: 'QA 전달', statuses: ['Need QA', 'In QA']},
	{key: 'review', label: '리뷰 전달', statuses: ['In Review']},
	{key: 'progress', label: '진행중', statuses: ['In Progress']},
	{key: 'backlog', label: 'Backlog', statuses: ['Backlog']},
];

function mapStatusToGroupKey(status: string): StatusGroupKey {
	const group = STATUS_GROUPS.find((g) => g.statuses.includes(status));
	return group ? group.key : 'others';
}

function extractBracketTokens(summary: string): string[] {
	const regex = /\[([^\]]+)]/g;
	const tokens: string[] = [];
	let m: RegExpExecArray | null;
	while ((m = regex.exec(summary)) !== null) {
		tokens.push(m[1].trim());
	}
	return tokens;
}

function formatIssuesForReport(issues: JiraIssue[]): string {
	const groupedByStatus: Record<StatusGroupKey, JiraIssue[]> = {
		done: [],
		qa: [],
		review: [],
		progress: [],
		backlog: [],
		others: [],
	};

	for (const issue of issues) {
		const key = mapStatusToGroupKey(issue.status);
		groupedByStatus[key].push(issue);
	}

	const lines: string[] = [];

	for (const group of STATUS_GROUPS) {
		const groupIssues = groupedByStatus[group.key];
		if (!groupIssues || groupIssues.length === 0) continue;

		lines.push(`[${group.label}]`);

		const sorted = [...groupIssues].sort((a, b) => {
			const at = extractBracketTokens(a.summary);
			const bt = extractBracketTokens(b.summary);

			const aThird = at[2] ?? '';
			const bThird = bt[2] ?? '';

			if (aThird !== bThird) {
				return aThird.localeCompare(bThird);
			}

			const aFirst = at[0] ?? '';
			const bFirst = bt[0] ?? '';

			if (aFirst !== bFirst) {
				return aFirst.localeCompare(bFirst);
			}

			return a.summary.localeCompare(b.summary);
		});

		for (const issue of sorted) {
			lines.push(issue.summary);
		}

		lines.push('');
	}

	return lines.join('\r\n');
}

function handleJiraExportClick() {
	const rows = collectIssueRows();
	const issues = rows
		.map(createIssueFromRow)
		.filter((issue): issue is JiraIssue => issue !== null);

	const text = formatIssuesForReport(issues);
	copyToClipboard(text);
	alert(`정제된 이슈 ${issues.length}개를 클립보드에 복사했습니다.`);
}

