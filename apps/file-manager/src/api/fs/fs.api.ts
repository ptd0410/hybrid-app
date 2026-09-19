import { bridge } from "bridge";
import type { FsApi } from "./fs.type";

export const fsApi = bridge.createApi<FsApi>("fs");
