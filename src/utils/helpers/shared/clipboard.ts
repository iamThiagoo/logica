export const clipboard = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};
