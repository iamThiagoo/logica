import { getAuthToken } from './auth';

export const formatIo = (cd_io: number) => {
  return `IO${cd_io.toString().padStart(3, '0')}`;
};

export const onDownload = (io: any, forUserHistory = false) => {
  const ioFormat = io.cd_io ? formatIo(io.cd_io) : io.docs_historico?.value;
  let previewUrl = `${import.meta.env.VITE_APP_MS_DOCS}/docs/io/download/` + ioFormat;

  if (forUserHistory) {
    const token = getAuthToken();
    const authParam = encodeURIComponent(JSON.stringify({ token }));
    previewUrl = `${import.meta.env.VITE_APP_MS_DOCS}/docs/io/download/${ioFormat}/${io.versao}/${io.sub_versao}?auth=${authParam}`;
  }

  window.open(previewUrl, '_blank');
};

export const onPreview = (io: any, forUserHistory = false) => {
  const ioFormat = io.cd_io ? formatIo(io.cd_io) : io.docs_historico?.value;
  let previewUrl = `${import.meta.env.VITE_APP_MS_DOCS}/docs/io/preview/` + ioFormat;

  if (forUserHistory) {
    const token = getAuthToken();
    const authParam = encodeURIComponent(JSON.stringify({ token }));
    previewUrl = `${import.meta.env.VITE_APP_MS_DOCS}/docs/io/preview/${ioFormat}/${io.versao}/${io.sub_versao}?auth=${authParam}`;
  }

  window.open(previewUrl, '_blank');
};

export const getPreviewLink = (io: any) => {
  const ioFormat = io.cd_io ? formatIo(io.cd_io) : io.docs_historico?.value;
  const previewUrl = `${import.meta.env.VITE_APP_MS_DOCS}/docs/io/preview/` + ioFormat;
  return previewUrl;
};
