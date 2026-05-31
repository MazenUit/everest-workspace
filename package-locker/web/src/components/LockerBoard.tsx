import { useLockerStore } from '../store/locker-store';
import { Panel } from './Panel';

const btn =
  'rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-50';

export function LockerBoard() {
  const lockers = useLockerStore((s) => s.lockers);
  const loading = useLockerStore((s) => s.lockersLoading);
  const error = useLockerStore((s) => s.lockersError);
  const fetchLockers = useLockerStore((s) => s.fetchLockers);

  return (
    <Panel
      title="Lockers"
      action={
        <button type="button" className={btn} onClick={() => fetchLockers()} disabled={loading}>
          Refresh
        </button>
      }
    >
      {error && <p className="text-sm text-red-600">{error}</p>}
      {loading && !error && <p className="text-sm text-zinc-500">Loading…</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-zinc-600">
                <th className="py-2 pr-4 font-medium">ID</th>
                <th className="py-2 pr-4 font-medium">Size</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lockers.map((l) => (
                <tr key={l.id} className="border-b border-zinc-100">
                  <td className="py-2 pr-4 font-mono">{l.id}</td>
                  <td className="py-2 pr-4">{l.size}</td>
                  <td
                    className={`py-2 font-medium ${l.isAvailable ? 'text-green-700' : 'text-amber-700'}`}
                  >
                    {l.isAvailable ? 'Available' : 'In use'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
