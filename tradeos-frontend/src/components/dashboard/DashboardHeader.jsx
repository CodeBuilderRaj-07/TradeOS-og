export default function DashboardHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
        Dashboard
      </h1>

      <p className="text-sm text-muted-foreground">
        Welcome back, Trader
      </p>
    </div>
  );
}