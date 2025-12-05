

export function extractIssueKey(row: HTMLTableRowElement): string | null {
  const keyAnchor = row.querySelector<HTMLAnchorElement>(
    '[data-testid="native-issue-table.common.ui.issue-cells.issue-key.issue-key-cell"]'
  );
  return keyAnchor?.textContent?.trim() ?? null;
}


function isIssueListLoading(): boolean {
  const main = document.querySelector<HTMLElement>('[data-vc="issue-table-main-container"]');
  if (!main) return false;

  const children = Array.from(main.children) as HTMLElement[];
  const targetRoot = children[1];
  if (!targetRoot) return false;

  const walker = document.createTreeWalker(
    targetRoot,
    NodeFilter.SHOW_TEXT,
    null,
  );

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue ?? "";
    if (text.includes("더 로드 중")) {
      return true;
    }
  }

  return false;
}


function getIssueCount(): { current: number; total: number } {
  const countEl = document.querySelector<HTMLElement>(
    '[data-testid="issue-navigator.ui.issue-results.list-view.issue-count.text"] > span',
  );
  if (!countEl) return { current: 0, total: 0 };

  const text = countEl.textContent ?? "";
  // 예: "118 중 118" / "1,234 중 2,000"
  const match = text.match(/([\d,]+)\s*중\s*([\d,]+)/);
  if (!match) return { current: 0, total: 0 };

  const current = parseInt(match[2].replace(/,/g, ""), 10);
  const total = parseInt(match[1].replace(/,/g, ""), 10);
  return { current, total };
}

export const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function collectAllIssueRows(): Promise<HTMLTableRowElement[]> {
  const container = document.querySelector('[data-testid="native-issue-table.ui.scroll-container.scroll-container"]') as HTMLElement | null;
  if (!container) {
    alert("Jira 이슈 테이블 스크롤 컨테이너를 찾지 못했습니다.");
    return [];
  }

  container.scrollTop = 0;
  await wait(200);

  const seenKeys = new Set<string>();
  const collected: HTMLTableRowElement[] = [];



  const MAX_DURATION_MS = 20000;
  const MAX_NO_PROGRESS_LOOPS = 20;
  const SCROLL_WAIT_MS = 300;
  const FINAL_WAIT_MS = 500;

  const startTime = Date.now();
  let noProgressLoops = 0;
  let lastProgressKey = "";

  while (true) {
    const { current, total } = getIssueCount();

    const rows = document.querySelectorAll<HTMLTableRowElement>(
      'tr[data-testid="native-issue-table.ui.issue-row"]',
    );

    // 🔥 여기서 Key 기준 중복 제거
    rows.forEach((row) => {
      const key = extractIssueKey(row);
      if (!key) return;

      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        collected.push(row);
      }
    });

    const atBottom =
      container.scrollTop + container.clientHeight >= container.scrollHeight - 2;
    const loading = isIssueListLoading();

    const progressKey = `${current}:${collected.length}`;
    if (progressKey === lastProgressKey) {
      noProgressLoops += 1;
    } else {
      noProgressLoops = 0;
      lastProgressKey = progressKey;
    }

    if (total > 0 && current >= total && atBottom && !loading) {
      await wait(FINAL_WAIT_MS);

      // 🔥 마지막으로 한 번 더 Key 기준으로 수집
      const finalRows = document.querySelectorAll<HTMLTableRowElement>(
        'tr[data-testid="native-issue-table.ui.issue-row"]',
      );
      finalRows.forEach((row) => {
        const key = extractIssueKey(row);
        if (!key) return;

        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          collected.push(row);
        }
      });

      break;
    }

    if (Date.now() - startTime > MAX_DURATION_MS || noProgressLoops > MAX_NO_PROGRESS_LOOPS) {
      console.warn("이슈 로딩이 너무 오래 걸리거나 진행이 없어 루프 종료");
      break;
    }

    const scrollStep = Math.min(container.clientHeight, 500);
    container.scrollTop += scrollStep;
    await wait(SCROLL_WAIT_MS);
  }

  return collected;
}

export function ensureCorrectJiraPage(query: string) {
  const targetUrl = "https://prndcompany.atlassian.net/issues/";
  const current = window.location.href;

  // 같은 도메인이지만 URL이 다를 수 있으니 startsWith로 확인
  if (!current.startsWith(targetUrl)) {
    window.location.href = `${targetUrl}${query}`;
    return false; // 이후 로직 중단
  }

  return true;
}
