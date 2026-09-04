export interface DailyPoint {
  date: string; // YYYY-MM-DD
  value: number;
}

function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${Number(month)}/${Number(day)}`;
}

/** A static (no-JS-required) daily bar chart. Values are always visible, and a screen-reader-only table carries the same data for anyone who can't read the bars. */
export function DailyTrendChart({ points, label }: { points: DailyPoint[]; label: string }) {
  const max = Math.max(...points.map((p) => p.value), 1);

  return (
    <div>
      <div className="flex h-32 items-end gap-1.5" role="img" aria-label={`${label} for the last ${points.length} days`}>
        {points.map((point) => (
          <div key={point.date} className="flex flex-1 flex-col items-center gap-1" title={`${point.date}: ${point.value.toLocaleString()}`}>
            <span className="text-[10px] tabular-nums text-zinc-500">{point.value > 0 ? point.value.toLocaleString() : ""}</span>
            <div
              className="w-full rounded-t bg-indigo-600"
              style={{ height: `${Math.max(2, (point.value / max) * 80)}px` }}
            />
            <span className="text-[10px] text-zinc-400">{formatShortDate(point.date)}</span>
          </div>
        ))}
      </div>

      <table className="sr-only">
        <caption>{label} by day</caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.date}>
              <td>{point.date}</td>
              <td>{point.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
