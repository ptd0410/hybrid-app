import { windowManager } from "@/modules/window";

export async function launchApp(appId: string) {
  return windowManager.open({
    id: appId,
    url: `app://${appId}/index.html`,
  });
}
