import fs from "node:fs";
import path from "node:path";
import { getAppsDir } from "../../app.helper";

const downloadDir = getAppsDir("downloads");

fs.mkdirSync(downloadDir, {
  recursive: true,
});

export async function download(url: string, fileName: string): Promise<string> {
  const filePath = path.join(downloadDir, fileName);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download app: ${response.status} ${response.statusText}`,
    );
  }

  if (!response.body) {
    throw new Error("Download response has no body");
  }

  const fileHandle = await fs.promises.open(filePath, "w");

  try {
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      await fileHandle.write(value);
    }

    return filePath;
  } catch (error) {
    await fs.promises.rm(filePath, {
      force: true,
    });

    throw error;
  } finally {
    await fileHandle.close();
  }
}
