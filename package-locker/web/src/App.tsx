import { useState } from 'react';
import { LockerBoard } from './components/LockerBoard';
import { RetrievePackage } from './components/RetrievePackage';
import { StorePackage } from './components/StorePackage';

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <main className="app">
      <header>
        <h1>Package Locker Demo</h1>
      </header>
      <LockerBoard refreshKey={refreshKey} />
      <div className="columns">
        <StorePackage onStored={bump} />
        <RetrievePackage onRetrieved={bump} />
      </div>
    </main>
  );
}
