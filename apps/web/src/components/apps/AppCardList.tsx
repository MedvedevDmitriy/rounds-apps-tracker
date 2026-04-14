import type { IAppListItem } from "../../shared/interfaces";
import { AppCard } from "./AppCard";

type AppCardListProps = {
  apps: IAppListItem[];
  deletingAppId: string | null;
  onOpenApp: (id: string) => void;
  onDeleteApp: (app: IAppListItem) => void;
};

export function AppCardList({
  apps,
  deletingAppId,
  onOpenApp,
  onDeleteApp,
}: AppCardListProps) {
  return (
    <ul className="app-grid" aria-label="Tracked apps">
      {apps.map((app) => (
        <AppCard
          key={app.id}
          app={app}
          isDeleting={deletingAppId === app.id}
          onOpen={() => onOpenApp(app.id)}
          onDelete={() => onDeleteApp(app)}
        />
      ))}
    </ul>
  );
}
