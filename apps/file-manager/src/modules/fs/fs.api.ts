import { bridge } from "bridge";
import type { FsApi } from "types";

export const fsApi = bridge.createApi<FsApi>("fs");
