type Props = {
  size?: 'sm' | 'md';
  /** White accent for dark buttons */
  onDark?: boolean;
  className?: string;
};

export function Spinner({ size = 'sm', onDark = false, className = '' }: Props) {
  const dim = size === 'md' ? 'h-5 w-5 border-2' : 'h-3.5 w-3.5 border-2';
  const colors = onDark
    ? 'border-zinc-500 border-t-white'
    : 'border-zinc-200 border-t-zinc-700';

  return (
    <span
      role="status"
      aria-hidden={false}
      aria-label="Loading"
      className={`inline-block shrink-0 animate-spin rounded-full ${dim} ${colors} ${className}`}
    />
  );
}
