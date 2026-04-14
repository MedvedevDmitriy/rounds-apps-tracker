import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { AddAppForm } from "../components/apps/AddAppForm";
import { AppCardList } from "../components/apps/AppCardList";
import { Alert } from "../components/Alert";
import type { IAppListItem } from "../shared/interfaces";
import { getApiErrorMessage } from "../utils/apiError";
import "./AppsPage.css";

async function fetchAppsList(): Promise<IAppListItem[]> {
  const res = await api.get<IAppListItem[]>("/apps");
  return res.data;
}

function AppsPage() {
  const [apps, setApps] = useState<IAppListItem[]>([]);
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingAppId, setDeletingAppId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadApps = useCallback(async () => {
    setLoadError(null);
    setIsLoading(true);
    try {
      const next = await fetchAppsList();
      setApps(next);
    } catch (e) {
      setLoadError(getApiErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadApps();
  }, [loadApps]);

  const handleAddApp = async () => {
    if (!url.trim()) {
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await api.post(`/apps`, { url });
      setUrl("");
      const next = await fetchAppsList();
      setApps(next);
      setLoadError(null);
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteApp = async (app: IAppListItem) => {
    if (deletingAppId) {
      return;
    }

    const confirmed = window.confirm(
      `Delete tracked app ${app.googlePlayId}? This will remove the app and its saved screenshots.`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setDeletingAppId(app.id);

    try {
      await api.delete(`/apps/${app.id}`);
      setApps((current) => current.filter((item) => item.id !== app.id));
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setDeletingAppId(null);
    }
  };

  const showEmptyMessage =
    !isLoading && !loadError && apps.length === 0;
  const showList = !isLoading && !loadError && apps.length > 0;

  return (
    <div className="stack">
      <header>
        <h1 className="apps-page__title">Tracked apps</h1>
        <p className="apps-page__lead">
          Paste a Google Play store URL to start capturing listing screenshots.
        </p>
      </header>

      <AddAppForm
        url={url}
        isSubmitting={isSubmitting}
        onUrlChange={setUrl}
        onSubmit={() => void handleAddApp()}
      />

      {error ? <Alert variant="error">{error}</Alert> : null}

      {isLoading ? (
        <p className="muted text-center">Loading apps…</p>
      ) : null}

      {!isLoading && loadError ? (
        <div className="stack-sm">
          <Alert variant="error">{loadError}</Alert>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => void loadApps()}
          >
            Retry
          </button>
        </div>
      ) : null}

      {showEmptyMessage ? (
        <p className="apps-page__empty">
          No apps yet. Add a Play Store URL above.
        </p>
      ) : null}

      {showList ? (
        <AppCardList
          apps={apps}
          deletingAppId={deletingAppId}
          onOpenApp={(appId) => navigate(`/apps/${appId}`)}
          onDeleteApp={(app) => void handleDeleteApp(app)}
        />
      ) : null}
    </div>
  );
}

export default AppsPage;
