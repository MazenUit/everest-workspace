import type { ReactNode } from 'react';

type Props = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function Panel({ title, action, children }: Props) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
