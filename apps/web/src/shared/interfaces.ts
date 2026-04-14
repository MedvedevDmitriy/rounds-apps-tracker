export interface IScreenshot {
  id: string;
  imagePath: string;
  createdAt: string;
  capturedAt: string;
}

export interface IApp {
  id: string;
  googlePlayId: string;
  url: string;
  title?: string | null;
  screenshots: IScreenshot[];
}

export interface IAppListItem {
  id: string;
  googlePlayId: string;
  title?: string | null;
  _count: { screenshots: number };
}
