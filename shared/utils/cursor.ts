export interface CursorData {
  createdAt: string;
  id: string;
}

export function encodeCursor(createdAt: Date, id: string): string {
  const data: CursorData = {
    createdAt: createdAt.toISOString(),
    id,
  };
  return Buffer.from(JSON.stringify(data)).toString('base64url');
}

export function decodeCursor(cursor: string): CursorData {
  try {
    const json = Buffer.from(cursor, 'base64url').toString('utf-8');
    const data = JSON.parse(json) as CursorData;
    if (!data.createdAt || !data.id) {
      throw new Error('Invalid cursor format');
    }
    return data;
  } catch {
    throw new Error('Invalid cursor');
  }
}
