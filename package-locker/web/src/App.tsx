import { useEffect } from 'react';
import { LockerBoard } from './components/LockerBoard';
import { RetrievePackage } from './components/RetrievePackage';
import { StorePackage } from './components/StorePackage';
import { useLockerStore } from './store/locker-store';

export default function App() {
  const fetchLockers = useLockerStore((s) => s.fetchLockers);

  useEffect(() => {
    fetchLockers();
  }, [fetchLockers]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Package Locker Demo
        </h1>
      </header>
      <div className="mb-4">
        <LockerBoard />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StorePackage />
        <RetrievePackage />
      </div>
    </main>
  );
}
