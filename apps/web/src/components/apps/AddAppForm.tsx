import type { ChangeEvent, FormEvent } from "react";

type AddAppFormProps = {
  url: string;
  isSubmitting: boolean;
  onUrlChange: (value: string) => void;
  onSubmit: () => void;
};

export function AddAppForm({
  url,
  isSubmitting,
  onUrlChange,
  onSubmit,
}: AddAppFormProps) {
  return (
    <section className="form-block" aria-labelledby="add-app-label">
      <label id="add-app-label" htmlFor="input-url">
        Google Play URL
      </label>
      <form
        className="input-row"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input
          id="input-url"
          className="input"
          value={url}
          type="text"
          inputMode="url"
          placeholder="https://play.google.com/store/apps/details?id=…"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onUrlChange(e.target.value)
          }
          disabled={isSubmitting}
          autoComplete="off"
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !url.trim()}
        >
          {isSubmitting ? "Adding…" : "Add"}
        </button>
      </form>
    </section>
  );
}
