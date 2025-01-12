export function Logo({
  toggleFeedBackFlow,
}: {
  toggleFeedBackFlow: () => void;
}) {
  return (
    <>
      <div className="absolute top-4 left-4 z-50">
        <img
          src="/images/gumloop_logo_long.png"
          alt="Gumloop Logo"
          className="h-12 w-auto cursor-pointer transition-all duration-200 hover:scale-110"
          onClick={toggleFeedBackFlow}
        />
      </div>
    </>
  );
}
