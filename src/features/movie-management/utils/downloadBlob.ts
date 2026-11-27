export function downloadBlob(blob: Blob, filename: string): void {
   const objectUrl: string = URL.createObjectURL(blob);
   const anchor: HTMLAnchorElement = document.createElement('a');
   anchor.href = objectUrl;
   anchor.download = filename;
   anchor.click();
   URL.revokeObjectURL(objectUrl);
}
