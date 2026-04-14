import type { ChangeEvent, FormEvent } from "react";
import { Alert } from "../Alert";

type AppEditFormProps = {
  editUrl: string;
  editTitle: string;
  isSubmitting: boolean;
  editError: string | null;
  differentAppPrompt: boolean;
  currentGooglePlayId: string;
  onEditUrlChange: (value: string) => void;
  onEditTitleChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onCancelDifferentApp: () => void;
  onCreateAsNewTrackedApp: () => void | Promise<void>;
};

export function AppEditForm({
  editUrl,
  editTitle,
  isSubmitting,
  editError,
  differentAppPrompt,
  currentGooglePlayId,
  onEditUrlChange,
  onEditTitleChange,
  onSubmit,
  onCancelDifferentApp,
  onCreateAsNewTrackedApp,
}: AppEditFormProps) {
  return (
    <form
      className="form-block app-edit-form"
      onSubmit={(e) => void onSubmit(e)}
    >
      <label htmlFor="edit-url">Google Play URL</label>
      <input
        id="edit-url"
        className="input"
        type="text"
        value={editUrl}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onEditUrlChange(e.target.value)
        }
        disabled={isSubmitting}
        required
        autoComplete="off"
      />
      <label htmlFor="edit-title">Title (optional)</label>
      <input
        id="edit-title"
        className="input"
        type="text"
        value={editTitle}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onEditTitleChange(e.target.value)
        }
        disabled={isSubmitting}
        maxLength={500}
        autoComplete="off"
      />
      {differentAppPrompt ? (
        <Alert
          variant="warning"
          className="app-edit-form__different-app"
        >
          <p>
            This URL points to a different app. Existing screenshots belong to{" "}
            <span className="app-edit-form__mono">{currentGooglePlayId}</span>{" "}
            and will stay with that tracked app. The new URL will be created as
            a new tracked app. If you entered a title, it will apply to the new
            tracked app.
          </p>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isSubmitting}
              onClick={onCancelDifferentApp}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={isSubmitting}
              onClick={() => void onCreateAsNewTrackedApp()}
            >
              {isSubmitting ? "Creating…" : "Create as new tracked app"}
            </button>
          </div>
        </Alert>
      ) : null}
      {editError ? (
        <Alert variant="error">{editError}</Alert>
      ) : null}
      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            isSubmitting || !editUrl.trim() || differentAppPrompt
          }
        >
          {isSubmitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}
