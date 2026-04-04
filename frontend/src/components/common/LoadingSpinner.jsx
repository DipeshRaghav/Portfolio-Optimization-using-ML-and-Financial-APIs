export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="spinner"></div>
      <p className="text-slate-500 text-sm">{message}</p>
    </div>
  );
}
