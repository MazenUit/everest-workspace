import { useCallback, useEffect, useState } from 'react';
import { listLockers } from '../api/client';
import type { Locker } from '../types';

type Props = { refreshKey: number };

export function LockerBoard({ refreshKey }: Props) {
  const [lockers, setLockers] = useState<Locker[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await listLockers();
    setLoading(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    setLockers(result.data.lockers);
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Lockers</h2>
        <button type="button" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {loading && !error && <p>Loading…</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Size</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lockers.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.size}</td>
                <td className={l.isAvailable ? 'ok' : 'busy'}>
                  {l.isAvailable ? 'Available' : 'In use'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
