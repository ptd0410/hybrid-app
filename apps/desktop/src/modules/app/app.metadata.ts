export type AppMetadata = {
  id: string;
  version: string;
  name: string;
  zipUrl: string;
};

export const appCatalog: Record<string, AppMetadata> = {
  "file-manager": {
    id: "file-manager",
    version: "0.0.2",
    name: "File Manager",
    zipUrl:
      "https://pub-0fa2b5c990d24a9da80ac55652360c08.r2.dev/file-manager.zip",
  },
  home: {
    id: "home",
    version: "0.0.1",
    name: "File Manager",
    zipUrl: "https://pub-0fa2b5c990d24a9da80ac55652360c08.r2.dev/home.zip",
  },
};
