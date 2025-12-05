import type { MenuItem } from "../types.ts";
import { collectAllIssueRows, ensureCorrectJiraPage, extractIssueKey } from './utils';

export const createJiraDaily: MenuItem = {
	id: 'jira-daily',
  label: '데일리 지라 복사',
	icon: '🗓️',
	onClick: handleJiraDailyReportClick
};


type JiraIssue = {
  key: string;
  summary: string;
  status: string;
};

function mapStatusToLabel(status: string): string {
  switch (status) {
    case "Deployed":
    case "종료":
      return "배포 완료";
    case "Need QA":
    case "In QA":
    case "Ready to Deploy":
      return "QA 전달";
    case "In Review":
    case "검토 중":
      return "리뷰 진행중";
    case "In Progress":
    case "진행 중":
      return "진행중";
    case "Backlog":
      return "Backlog";
    default:
      return status;
  }
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

function createIssueFromRow(row: HTMLTableRowElement): JiraIssue | null {
  const key = extractIssueKey(row);
  const summary = extractIssueSummary(row);
  const status = extractIssueStatus(row);

  if (!key || !summary || !status) return null;
  return { key, summary, status };
}

function extractIssueSummary(row: HTMLTableRowElement): string | null {
  const summarySpan = row.querySelector<HTMLSpanElement>(
    '[data-testid="native-issue-table.common.ui.issue-cells.issue-summary.issue-summary-cell"]',
  );
  return summarySpan?.textContent?.trim() ?? null;
}

function extractIssueStatus(row: HTMLTableRowElement): string | null {
  const statusButton = row.querySelector(
    '[data-vc="native-issue-table-ui-issue-status-box"] button[aria-label]',
  ) as HTMLButtonElement | null;
  if (!statusButton) return null;

  const ariaLabel = statusButton.getAttribute("aria-label");
  return ariaLabel?.split(" - ")[0] ?? null;
}

function copyToClipboard(text: string) {
  const normalized = text.replace(/\r?\n/g, "\r\n");

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(normalized).catch(() => {});
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = normalized;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

function formatIssuesForDailyReport(issues: JiraIssue[]): string {
  const lines: string[] = [];

  // ------------------------------
  // 1. 오늘 완료 업무 (Backlog 제외 전부 포함)
  // ------------------------------
  lines.push(":o_표시를_한_남성: 오늘 완료 업무");

  const doneTargets = issues.filter((issue) => issue.status !== "Backlog");

  const sortedDone = [...doneTargets].sort((a, b) => {
    const at = extractBracketTokens(a.summary);
    const bt = extractBracketTokens(b.summary);

    const aThird = at[2] ?? "";
    const bThird = bt[2] ?? "";
    if (aThird !== bThird) return aThird.localeCompare(bThird);

    const aFirst = at[0] ?? "";
    const bFirst = bt[0] ?? "";
    if (aFirst !== bFirst) return aFirst.localeCompare(bFirst);

    return a.summary.localeCompare(b.summary);
  });

  for (const issue of sortedDone) {
    const label = mapStatusToLabel(issue.status);
    lines.push(`${issue.summary} - ${label}`);
  }

  lines.push("");

  // ------------------------------
  // 2. 이후 예정 업무
  //    조건:
  //    - 상태가 배포 완료가 아닌 모든 이슈
  //    - 대괄호가 연속 3번 이상
  //    - 마지막 대괄호 뒤에 텍스트가 없는 경우만
  // ------------------------------
  lines.push(":기술자: 이후 예정 업무");

  const futureTargets = issues.filter((issue) => {
    const label = mapStatusToLabel(issue.status);
    if (label === "배포 완료") return false;

    const summary = issue.summary.trim();
    const tokens = extractBracketTokens(summary);
    if (tokens.length < 3) return false;

    // 대괄호 뒤에 텍스트 없는 패턴만 허용
    // 예: "[REVOLT] [www] [이슈명]" ← OK
    //     "[REVOLT] [www] [이슈명] 작업중" ← 제외
    const onlyBrackets = /^(\[[^\]]+]\s*)+$/.test(summary);
    return onlyBrackets;
  });

  const sortedFuture = [...futureTargets].sort((a, b) => {
    const at = extractBracketTokens(a.summary);
    const bt = extractBracketTokens(b.summary);

    const aThird = at[2] ?? "";
    const bThird = bt[2] ?? "";
    if (aThird !== bThird) return aThird.localeCompare(bThird);

    const aFirst = at[0] ?? "";
    const bFirst = bt[0] ?? "";
    if (aFirst !== bFirst) return aFirst.localeCompare(bFirst);

    return a.summary.localeCompare(b.summary);
  });

  for (const issue of sortedFuture) {
    lines.push(issue.summary);
  }
  return lines.join("\r\n");
}

async function handleJiraDailyReportClick() {
  if (!ensureCorrectJiraPage("")) {
    return;
  }

  const rows = await collectAllIssueRows();
  const issues = rows
    .map(createIssueFromRow)
    .filter((issue): issue is JiraIssue => issue !== null);

  const text = formatIssuesForDailyReport(issues);
  copyToClipboard(text);
  alert(`일일 리포트용 이슈 ${issues.length}개를 클립보드에 복사했습니다.`);
}
