import { contextBridge, ipcRenderer } from 'electron';

export const outputFormats = [
  'avif',
  'gif',
  'jpg',
  'jpeg',
  'png',
  'raw',
  'tiff',
  'webp',
] as const;

export type OutputFormat = (typeof outputFormats)[number];

export interface EditFileArgs {
  filePath: string;
  fileFormat: OutputFormat;
  quality?: number;
}

export interface ElectronAPI {
  /* testy test */
  openFile: () => Promise<string>;
  editFile: (args: EditFileArgs) => Promise<string>;
}

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  editFile: (args: EditFileArgs) => ipcRenderer.sendSync('editFile', args),
});
