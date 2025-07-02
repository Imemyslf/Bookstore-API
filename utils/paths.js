import path from 'path';
import { fileURLToPath } from 'url';

export function resolvePath(relativePath, metaUrl) {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, relativePath);
}
