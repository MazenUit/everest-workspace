import { useState } from 'react';
import { storePackage } from '../api/client';
import type { PackageSize } from '../types';

type Props = { onStored: () => void };

const SIZES: PackageSize[] = ['SMALL', 'MEDIUM', 'LARGE'];

export function StorePackage({ onStored }: Props) {
  const [size, setSize] = useState<PackageSize>('SMALL');
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ lockerId: string; pickupCode: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setSuccess(null);
    const result = await storePackage(size);
    setBusy(false);
    if (!result.ok) {
      setMessage(result.error.message);
      return;
    }
    setSuccess({ lockerId: result.data.lockerId, pickupCode: result.data.pickupCode });
    onStored();
  }

  return (
    <section className="panel">
      <h2>Store package (delivery)</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Size
          <select value={size} onChange={(e) => setSize(e.target.value as PackageSize)}>
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={busy}>
          Store
        </button>
      </form>
      {message && <p className="error">{message}</p>}
      {success && (
        <div className="success">
          <p>
            Locker: <strong>{success.lockerId}</strong>
          </p>
          <p>
            Pickup code: <strong>{success.pickupCode}</strong>
          </p>
        </div>
      )}
    </section>
  );
}
