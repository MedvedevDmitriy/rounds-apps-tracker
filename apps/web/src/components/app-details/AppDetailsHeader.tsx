import type { ReactNode } from "react";

type AppDetailsHeaderProps = {
  googlePlayId: string;
  title: string | null | undefined;
  showTitle: boolean;
  onBack: () => void;
  actions: ReactNode;
};

export function AppDetailsHeader({
  googlePlayId,
  title,
  showTitle,
  onBack,
  actions,
}: AppDetailsHeaderProps) {
  return (
    <header className="app-details__header">
      <div className="app-details__header-text">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
        <h1 className="app-details__id">{googlePlayId}</h1>
        {showTitle && title ? (
          <p className="app-details__title">{title}</p>
        ) : null}
      </div>
      <div className="app-details__actions">{actions}</div>
    </header>
  );
}
