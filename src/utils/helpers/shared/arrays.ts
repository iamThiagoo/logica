import gif from '@/assets/images/404.gif';
import logo from '@/assets/svg/logo.svg';
import wave from '@/assets/images/wave.png';

export const formatColumnsSearch = (headers: any) => {
  return headers
    .filter((item: any) => item.search !== '')
    .map((item: any) => ({
      key: item.fieldSearch ?? item.name,
      value: item.search,
    }));
};

export const preload = () => {
  const sources = [logo, wave, gif];

  sources.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};
