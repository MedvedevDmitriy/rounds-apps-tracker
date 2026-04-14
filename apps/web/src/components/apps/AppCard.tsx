import type { IAppListItem } from "../../shared/interfaces";

type AppCardProps = {
  app: IAppListItem;
  onOpen: () => void;
};

export function AppCard({ app, onOpen }: AppCardProps) {
  return (
    <li className="app-card">
      <div className="app-card__id">{app.googlePlayId}</div>
      {app.title ? <p className="app-card__title">{app.title}</p> : null}
      <div className="app-card__meta">
        {app._count.screenshots === 1
          ? "1 screenshot"
          : `${app._count.screenshots} screenshots`}
      </div>
      <div className="app-card__actions">
        <button type="button" className="btn btn-primary" onClick={onOpen}>
          Open
        </button>
      </div>
    </li>
  );
}
