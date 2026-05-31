import { useState } from 'react';
import { retrievePackage } from '../api/client';

type Props = { onRetrieved: () => void };

export function RetrievePackage({ onRetrieved }: Props) {
  const [lockerId, setLockerId] = useState('');
  const [pickupCode, setPickupCode] = useState('');
  const [simulatedNow, setSimulatedNow] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [charge, setCharge] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    setCharge(null);
    let simulatedIso: string | undefined;
    if (simulatedNow) {
      const at = new Date(simulatedNow);
      if (!Number.isNaN(at.getTime())) {
        simulatedIso = at.toISOString();
      }
    }
    const result = await retrievePackage(lockerId.trim(), pickupCode.trim(), simulatedIso);
    setBusy(false);
    if (!result.ok) {
      setMessage(result.error.message);
      return;
    }
    setCharge(result.data.storageCharge);
    onRetrieved();
  }

  return (
    <section className="panel">
      <h2>Retrieve package (customer)</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Locker ID
          <input value={lockerId} onChange={(e) => setLockerId(e.target.value)} required />
        </label>
        <label>
          Pickup code
          <input value={pickupCode} onChange={(e) => setPickupCode(e.target.value)} required />
        </label>
        <details>
          <summary>Demo: simulate retrieve time (dev API only)</summary>
          <label>
            Retrieve at
            <input
              type="datetime-local"
              value={simulatedNow}
              onChange={(e) => setSimulatedNow(e.target.value)}
            />
          </label>
        </details>
        <button type="submit" disabled={busy}>
          Retrieve
        </button>
      </form>
      {message && <p className="error">{message}</p>}
      {charge !== null && (
        <p className="success">
          Storage charge: <strong>{charge}</strong>
        </p>
      )}
    </section>
  );
}
