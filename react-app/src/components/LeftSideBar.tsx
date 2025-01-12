export function LeftSideBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed left-5 top-24 z-50 flex flex-col gap-4 p-2">
      {children}
    </div>
  );
}
