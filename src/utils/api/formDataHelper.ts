export const toFormData = (data: Record<string, unknown>): FormData => {
  const formData = new FormData();

  const appendValue = (key: string, value: unknown): void => {
    if (value === null || value === undefined) return;

    if (value instanceof FileList) {
      Array.from(value).forEach(file => formData.append(`${key}[]`, file, file.name));
    } else if (value instanceof Blob) {
      formData.append(key, value, value instanceof File ? value.name : undefined);
    } else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    } else if (Array.isArray(value)) {
      value.forEach(item => appendValue(`${key}[]`, item));
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  };

  Object.entries(data).forEach(([key, value]) => appendValue(key, value));

  return formData;
};