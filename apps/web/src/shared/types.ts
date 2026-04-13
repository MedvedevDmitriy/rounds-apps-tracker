interface IScreenshot {
  id: string;
  imagePath: string;
  createdAt: string;
  capturedAt: string;
}

export interface IApp {
  id: string;
  appId: string;
  screenshots: IScreenshot[];
}
