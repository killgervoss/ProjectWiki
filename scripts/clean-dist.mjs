import { rm } from 'node:fs/promises';

// Clear only this project's generated output, never source content or assets.
const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
