import { AuctionCategory } from '@/types/auction.type';

export type FlattenedCategoryRow = AuctionCategory & {
  depth: number;
  pathLabel: string;
};

export function buildCategoryTree(categories: AuctionCategory[]) {
  const byId = new Map<string, AuctionCategory>();
  categories.forEach((c) => byId.set(c.id, c));

  const children = new Map<string | null, AuctionCategory[]>();
  for (const c of categories) {
    const key = c.parentId ?? null;
    const arr = children.get(key) ?? [];
    arr.push(c);
    children.set(key, arr);
  }

  for (const [, arr] of children) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  }

  return { byId, children };
}

export function flattenCategoryTree(
  categories: AuctionCategory[]
): FlattenedCategoryRow[] {
  const { byId, children } = buildCategoryTree(categories);

  const rows: FlattenedCategoryRow[] = [];

  function getPathLabel(node: AuctionCategory) {
    const names: string[] = [];
    const seen = new Set<string>();
    let cur: AuctionCategory | undefined = node;
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      names.push(cur.name);
      const pid: string | null = cur.parentId;
      cur = pid ? byId.get(pid) : undefined;
    }
    return names.reverse().join(' / ');
  }

  function walk(parentId: string | null, depth: number) {
    const list = children.get(parentId) ?? [];
    for (const node of list) {
      rows.push({
        ...node,
        depth,
        pathLabel: getPathLabel(node),
      });
      walk(node.id, depth + 1);
    }
  }

  walk(null, 0);

  // If the backend sent only a subtree / invalid parentId, include orphan nodes at end.
  const seenIds = new Set(rows.map((r) => r.id));
  const orphans = categories
    .filter((c) => !seenIds.has(c.id))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => ({
      ...c,
      depth: 0,
      pathLabel: getPathLabel(c),
    }));

  return [...rows, ...orphans];
}
