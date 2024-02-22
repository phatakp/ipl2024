export const Loader = () => {
  return (
    <div className="flex space-x-2 justify-center items-center w-full">
      <span className="sr-only">Loading...</span>
      <div className="h-4 w-4 bg-muted rounded-full animate-pulse [animation-delay:-0.3s]" />
      <div className="h-4 w-4 bg-muted rounded-full animate-pulse [animation-delay:-0.15s]" />
      <div className="h-4 w-4 bg-muted rounded-full animate-pulse" />
    </div>
  );
};
