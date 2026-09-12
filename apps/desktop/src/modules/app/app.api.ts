import { appCatalog, AppMetadata } from "./app.metadata";

export const appApi = {
  async fetchAppMetadata(appId: string): Promise<AppMetadata | undefined> {
    return appCatalog[appId];
  },
};
