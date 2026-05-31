import { useLockerStore } from '../store/locker-store';
import { Panel } from './Panel';
import { Spinner } from './Spinner';

const btn =
  'inline-flex items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-60';

export function LockerBoard() {
  const lockers = useLockerStore((s) => s.lockers);
  const loading = useLockerStore((s) => s.lockersLoading);
  const error = useLockerStore((s) => s.lockersError);
  const fetchLockers = useLockerStore((s) => s.fetchLockers);

  const isRefresh = loading && lockers.length > 0;

  return (
    <Panel
      title="Lockers"
      action={
        <button type="button" className={btn} onClick={() => fetchLockers()} disabled={loading}>
          {loading && <Spinner />}
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      }
    >
      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading && !error && lockers.length === 0 && (
        <div className="flex justify-center py-8">
          <Spinner size="md" />
        </div>
      )}

      {!error && lockers.length > 0 && (
        <div className="relative overflow-x-auto">
          {isRefresh && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-white/75"
              aria-live="polite"
            >
              <Spinner size="md" />
            </div>
          )}
          <table
            className={`w-full min-w-[280px] text-left text-sm transition-opacity ${isRefresh ? 'opacity-40' : ''}`}
          >
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
