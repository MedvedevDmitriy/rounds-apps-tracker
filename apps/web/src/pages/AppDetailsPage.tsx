import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppDetailsHeader } from "../components/app-details/AppDetailsHeader";
import { AppEditForm } from "../components/app-details/AppEditForm";
import { ScreenshotTimeline } from "../components/app-details/ScreenshotTimeline";
import { Alert } from "../components/Alert";
import type { IApp } from "../shared/interfaces";
import { api } from "../api/client";
import { ensureApp } from "../utils/ensureApp";
import { getApiErrorMessage } from "../utils/apiError";
import { parseGooglePlayUrl } from "../utils/parseGooglePlayUrl";
import "./AppDetailsPage.css";

const apiOrigin =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

function AppDetailsPage() {
  const { id } = useParams<string>();
  const [app, setApp] = useState<IApp | undefined>();
  const [isInitialLoading, setIsInitialLoading] = useState(!!id);
  const [isCaptureLoading, setIsCaptureLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [differentAppPrompt, setDifferentAppPrompt] = useState(false);
  const navigate = useNavigate();

  const fetchApp = useCallback(async () => {
    if (!id) {
      throw new Error("Missing app id");
    }
    const res = await api.get<IApp>(`/apps/${id}`);
    return ensureApp(res.data);
  }, [id]);

  useEffect(() => {
    setIsEditing(false);
    setEditError(null);
    setDifferentAppPrompt(false);
  }, [id]);

  useEffect(() => {
    setDifferentAppPrompt(false);
  }, [editUrl]);

  useEffect(() => {
    if (!id) {
      setApp(undefined);
      setIsInitialLoading(false);
      return;
    }

    let cancelled = false;
    setError(null);
    setIsInitialLoading(true);
    void (async () => {
      try {
        const data = await fetchApp();
        if (!cancelled) {
          setApp(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setApp(undefined);
          setError(getApiErrorMessage(e));
        }
      } finally {
        if (!cancelled) {
          setIsInitialLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, fetchApp]);

  const retryInitialLoad = useCallback(() => {
    if (!id) {
      return;
    }
    setError(null);
    setIsInitialLoading(true);
    void (async () => {
      try {
        const data = await fetchApp();
        setApp(data);
        setError(null);
      } catch (e) {
        setApp(undefined);
        setError(getApiErrorMessage(e));
      } finally {
        setIsInitialLoading(false);
      }
    })();
  }, [id, fetchApp]);

  const handleCapture = useCallback(async () => {
    if (!id) {
      return;
    }
    setError(null);
    setIsCaptureLoading(true);
    try {
      await api.post(`/apps/${id}/capture`);
      const res = await api.get<IApp>(`/apps/${id}`);
      setApp(ensureApp(res.data));
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setIsCaptureLoading(false);
    }
  }, [id]);

  const openEdit = useCallback(() => {
    if (!app) {
      return;
    }
    setEditUrl(app.url);
    setEditTitle(app.title ?? "");
    setEditError(null);
    setDifferentAppPrompt(false);
    setIsEditing(true);
  }, [app]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setEditError(null);
    setDifferentAppPrompt(false);
  }, []);

  const handleCreateAsNewTrackedApp = useCallback(async () => {
    if (!app) {
      return;
    }
    setEditError(null);
    setIsEditSubmitting(true);
    try {
      const trimmedUrl = editUrl.trim();
      parseGooglePlayUrl(trimmedUrl);
      const trimmedTitle = editTitle.trim();
      const body: { url: string; title?: string } = { url: trimmedUrl };
      if (trimmedTitle !== "") {
        body.title = trimmedTitle;
      }
      const res = await api.post<IApp>(`/apps`, body);
      setDifferentAppPrompt(false);
      setIsEditing(false);
      navigate(`/apps/${res.data.id}`);
    } catch (err) {
      setEditError(getApiErrorMessage(err));
    } finally {
      setIsEditSubmitting(false);
    }
  }, [app, editUrl, editTitle, navigate]);

  const handleEditSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!id || !app) {
        return;
      }
      setEditError(null);
      setIsEditSubmitting(true);
      try {
        const trimmedUrl = editUrl.trim();
        let parsed;
        try {
          parsed = parseGooglePlayUrl(trimmedUrl);
        } catch (err) {
          setEditError(getApiErrorMessage(err));
          return;
        }

        if (parsed.googlePlayId !== app.googlePlayId) {
          setDifferentAppPrompt(true);
          return;
        }

        const trimmedTitle = editTitle.trim();
        const body: { url: string; title?: string | null } = {
          url: trimmedUrl,
        };
        if (trimmedTitle !== "") {
          body.title = trimmedTitle;
        } else if (app.title) {
          body.title = null;
        }
        await api.patch(`/apps/${id}`, body);
        const fresh = await api.get<IApp>(`/apps/${id}`);
        setApp(ensureApp(fresh.data));
        setIsEditing(false);
        setEditError(null);
        setDifferentAppPrompt(false);
      } catch (err) {
        setEditError(getApiErrorMessage(err));
      } finally {
        setIsEditSubmitting(false);
      }
    },
    [id, app, editUrl, editTitle],
  );

  if (!id) {
    return (
      <div className="stack">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <p className="muted">Missing app id.</p>
      </div>
    );
  }

  if (isInitialLoading) {
    return <p className="muted text-center">Loading…</p>;
  }

  if (!app && error) {
    return (
      <div className="stack">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <Alert variant="error">{error}</Alert>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => void retryInitialLoad()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="stack">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
        <p className="muted">Could not load app.</p>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => void retryInitialLoad()}
        >
          Retry
        </button>
      </div>
    );
  }

  const screenshots = app.screenshots;

  return (
    <div className="stack">
      <AppDetailsHeader
        googlePlayId={app.googlePlayId}
        title={app.title}
        showTitle={!isEditing}
        onBack={() => navigate("/")}
        actions={
          <>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isCaptureLoading || isEditSubmitting}
              onClick={() => (isEditing ? cancelEdit() : openEdit())}
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isCaptureLoading || isEditing}
              onClick={() => void handleCapture()}
            >
              {isCaptureLoading ? "Capturing…" : "Capture now"}
            </button>
          </>
        }
      />

      {isEditing ? (
        <AppEditForm
          editUrl={editUrl}
          editTitle={editTitle}
          isSubmitting={isEditSubmitting}
          editError={editError}
          differentAppPrompt={differentAppPrompt}
          currentGooglePlayId={app.googlePlayId}
          onEditUrlChange={setEditUrl}
          onEditTitleChange={setEditTitle}
          onSubmit={handleEditSubmit}
          onCancelDifferentApp={() => setDifferentAppPrompt(false)}
          onCreateAsNewTrackedApp={handleCreateAsNewTrackedApp}
        />
      ) : null}

      {error ? (
        <Alert variant="error" className="app-details__capture-error">
          <div>{error}</div>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={isCaptureLoading}
            onClick={() => void handleCapture()}
          >
            Retry
          </button>
        </Alert>
      ) : null}

      {screenshots.length === 0 ? (
        <p className="app-details__empty">
          No screenshots yet. Use Capture now.
        </p>
      ) : null}

      <ScreenshotTimeline
        screenshots={screenshots}
        imageBaseUrl={apiOrigin}
      />
    </div>
  );
}

export default AppDetailsPage;
