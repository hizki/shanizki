/** Renders a fixed banner when running in the staging environment. */
function StagingBanner() {
  if (import.meta.env.VITE_APP_ENV !== 'staging') return null;

  return (
    <div
      role="status"
      aria-label="סביבת בדיקות"
      className="fixed top-0 inset-x-0 z-50 bg-amber-500 text-black text-center text-xs font-semibold py-0.5 tracking-wide select-none pointer-events-none"
    >
      STAGING
    </div>
  );
}

export default StagingBanner;
