import type { IScreenshot } from "../../shared/interfaces";

type ScreenshotTimelineProps = {
  screenshots: IScreenshot[];
  imageBaseUrl: string;
};

export function ScreenshotTimeline({
  screenshots,
  imageBaseUrl,
}: ScreenshotTimelineProps) {
  if (screenshots.length === 0) {
    return null;
  }

  return (
    <section className="app-details__timeline" aria-label="Screenshot history">
      {screenshots.map((s) => (
        <article key={s.id} className="timeline-card">
          <div className="timeline-card__meta">
            {new Date(s.capturedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </div>
          <figure className="timeline-card__media">
            <img
              src={`${imageBaseUrl}/${s.imagePath}`}
              alt={`Screenshot from ${new Date(s.capturedAt).toLocaleString()}`}
              loading="lazy"
            />
          </figure>
        </article>
      ))}
    </section>
  );
}
