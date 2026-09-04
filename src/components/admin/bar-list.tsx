export interface BarListItem {
  label: string;
  value: number;
}

/** A simple ranked horizontal bar list — labels and values are always visible, no hover required. */
export function BarList({ items, emptyMessage }: { items: BarListItem[]; emptyMessage: string }) {
  if (items.length === 0) {
    return <p className="text-sm text-zinc-500">{emptyMessage}</p>;
  }

  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate font-medium text-zinc-700">{item.label}</span>
            <span className="shrink-0 tabular-nums text-zinc-500">{item.value.toLocaleString()}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-indigo-600"
              style={{ width: `${Math.max(4, (item.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
