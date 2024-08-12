export function uint8ArrayToBase64(buffer: Uint8Array): string {
  let binary = "";
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

export function customStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    if (value instanceof Uint8Array) {
      return {
        type: "Uint8Array",
        data: uint8ArrayToBase64(value),
      };
    }
    return value;
  });
}
