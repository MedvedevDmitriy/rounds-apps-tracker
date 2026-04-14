import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { IApp } from "../shared/types";
import { api } from "../api/client";

const apiOrigin =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

function AppDetailsPage() {
  const { id } = useParams<string>();
  const [app, setApp] = useState<IApp>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const res = await api.get<IApp>(`/apps/${id}`);
        if (!cancelled) {
          setApp(res.data);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!app) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h2>{app.googlePlayId}</h2>
      <button onClick={() => navigate("/")}>← Back</button>
      {app.screenshots.length === 0 && <div>No screenshots yet</div>}

      {app.screenshots.map((s) => (
        <div key={s.id} style={{ marginBottom: 20 }}>
          <div>{new Date(s.capturedAt).toLocaleString()}</div>
          <img
            src={`${apiOrigin}/${s.imagePath}`}
            alt="screenshot"
            style={{ width: "300px" }}
          />
        </div>
      ))}

      <button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          try {
            await api.post(`/apps/${id}/capture`);
            const res = await api.get<IApp>(`/apps/${id}`);
            setApp(res.data);
          } catch {
            setError("Failed to capture screenshot");
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? "Capturing..." : "Capture now"}
      </button>
    </div>
  );
}

export default AppDetailsPage;
