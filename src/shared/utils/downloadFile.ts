import { tokenManager } from '@/features/authentication/utils/tokenManager';

export type ExpectedFileType = 'excel' | 'pdf';

const ACCEPT_BY_TYPE: Record<ExpectedFileType, string> = {
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
};

const getBaseURL = (): string => import.meta.env.VITE_API_BASE_URL || '/api';

const buildRequestUrl = (url: string): string => {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  return `${getBaseURL()}${normalizedPath}`;
};

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const text = await response.text();
    if (!text) {
      return `فشل التحميل (${response.status})`;
    }

    try {
      const json = JSON.parse(text) as { message?: string };
      return json.message || text;
    } catch {
      return text;
    }
  } catch {
    return `فشل التحميل (${response.status})`;
  }
};

const isValidFileContent = (
  contentType: string,
  expectedType: ExpectedFileType,
): boolean => {
  const type = contentType.toLowerCase();

  if (!type || type.includes('json') || type.includes('text/html')) {
    return false;
  }

  if (expectedType === 'pdf') {
    return type.includes('pdf') || type === 'application/octet-stream';
  }

  return (
    type.includes('spreadsheet') ||
    type.includes('excel') ||
    type.includes('sheet') ||
    type === 'application/octet-stream'
  );
};

export async function downloadFile(
  url: string,
  filename: string,
  expectedType: ExpectedFileType,
): Promise<void> {
  const token = tokenManager.getAccessToken();
  const headers: Record<string, string> = {
    Accept: ACCEPT_BY_TYPE[expectedType],
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildRequestUrl(url), {
    method: 'GET',
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    console.error('[downloadFile] Request failed:', response.status, message);
    throw new Error(message);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const buffer = await response.arrayBuffer();

  if (buffer.byteLength === 0) {
    console.error('[downloadFile] Empty file received:', url);
    throw new Error('الملف المستلم فارغ');
  }

  if (!isValidFileContent(contentType, expectedType)) {
    const text = new TextDecoder().decode(buffer);
    console.error('[downloadFile] Unexpected content type:', contentType, text.slice(0, 300));

    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        const json = JSON.parse(text) as { message?: string };
        throw new Error(json.message || 'الملف المستلم غير صالح');
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
      }
    }

    throw new Error('الملف المستلم غير صالح');
  }

  const blob = new Blob([buffer], {
    type: contentType || ACCEPT_BY_TYPE[expectedType],
  });

  const objectUrl = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(objectUrl);
}
