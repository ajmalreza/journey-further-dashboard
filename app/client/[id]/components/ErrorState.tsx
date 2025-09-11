interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500">Error loading campaigns: {error}</p>
    </div>
  );
}
