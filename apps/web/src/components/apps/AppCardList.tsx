import type { IAppListItem } from "../../shared/interfaces";
import { AppCard } from "./AppCard";

type AppCardListProps = {
  apps: IAppListItem[];
  onOpenApp: (id: string) => void;
};

export function AppCardList({ apps, onOpenApp }: AppCardListProps) {
  return (
    <ul className="app-grid" aria-label="Tracked apps">
      {apps.map((app) => (
        <AppCard key={app.id} app={app} onOpen={() => onOpenApp(app.id)} />
      ))}
    </ul>
  );
}
