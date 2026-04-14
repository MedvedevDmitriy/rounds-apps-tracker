import type { IAppListItem } from "../../shared/interfaces";

type AppCardProps = {
  app: IAppListItem;
  isDeleting: boolean;
  onOpen: () => void;
  onDelete: () => void;
};

export function AppCard({ app, isDeleting, onOpen, onDelete }: AppCardProps) {
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
        <button type="button" className="btn btn-secondary" onClick={onOpen}>
          Open
        </button>
        <button
          type="button"
          className="btn btn-danger"
          disabled={isDeleting}
          onClick={onDelete}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </li>
  );
}
