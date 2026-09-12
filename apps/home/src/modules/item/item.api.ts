import { apiClient } from "@/clients";

const url =
  "https://cdn.jsdelivr.net/gh/meta-node-blockchain/Default-Json-D-App@main-v1.0.2/test/windows/default_app_8x2f8.json";

export const itemApi = {
  fetchMainItems: async () => {
    const rs = (await apiClient.get(url)) as any;
    return rs.apps as any[];
  },
  fetchDockItems: async () => {
    const rs = (await apiClient.get(url)) as any;
    return rs.favorites as any[];
  },
  fetchItem: () => {},
};
