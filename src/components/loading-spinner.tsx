interface LoadingSpinnerProps {
  className?: string;
}

export const Spinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div
      className={`animate-spin inline-block w-12 h-12 border-[5px] border-current border-t-transparent text-primary rounded-full ${className}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  );
};

export default LoadingSpinner;
