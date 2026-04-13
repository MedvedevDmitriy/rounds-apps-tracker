import { useEffect, useState, type ChangeEvent } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import type { IApp } from "../shared/types";

function AppsPage() {
  const [apps, setApps] = useState<IApp[]>([]);
  const [url, setUrl] = useState<string>("");
  const navigate = useNavigate();

  const fetchApps = async () => {
    const res = await api.get("/apps");
    setApps(res.data);
  };

  const onChangeClick = (e: ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const onClickApp = (id: string) => {
    navigate(`/apps/${id}`);
  };

  const handleAddApp = async () => {
    if (!url.trim()) {
      return;
    }

    await api.post(`/apps`, { url });

    setUrl("");
    fetchApps();
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div>
      <label htmlFor="input-url">Please enter url to track your app</label>
      <input id="input-url" value={url} type="text" onChange={onChangeClick} />
      <button onClick={handleAddApp}>Add</button>
      {apps.length === 0 && <div>No data</div>}
      {apps && apps.length && (
        <ul>
          {apps.map((app) => {
            return (
              <li
                style={{ cursor: "pointer" }}
                onClick={() => onClickApp(app.id)}
                key={app.id}
              >
                {app.appId}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AppsPage;
