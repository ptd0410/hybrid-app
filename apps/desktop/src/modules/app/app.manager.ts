import { appsRepository } from "./app.repository";

export class AppManager {
  async getApps() {
    return appsRepository.getAll();
  }

  async getApp(id: string) {
    return appsRepository.getById(id);
  }
}

export const appManager = new AppManager();
