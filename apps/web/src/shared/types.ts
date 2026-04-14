interface IScreenshot {
  id: string;
  imagePath: string;
  createdAt: string;
  capturedAt: string;
}

export interface IApp {
  id: string;
  googlePlayId: string;
  title?: string | null;
  screenshots: IScreenshot[];
}
