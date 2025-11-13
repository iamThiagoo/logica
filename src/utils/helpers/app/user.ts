const colors = ['#158D65', '#7F1B9F', '#B68D00', '#E26D0E', '#10529E', '#6C727A'];

export const getAvatarColor = (name: string): string => colors[name.length % colors.length];

const getFirstLetter = (name: string) =>
  name
    .replace(/[^A-Za-z0-9]/g, '')
    .substr(0, 1)
    .toUpperCase();

export const renderSVGLetters = (username: string, viewSize = 200) => {
  const color = username === '?' ? '#000' : getAvatarColor(username);
  const initials = username === '?' ? username : getFirstLetter(username);

  const fontSize = viewSize / 1.6;

  return `
	<svg xmlns="http://www.w3.org/2000/svg" width="${viewSize}" height="${viewSize}" viewBox="0 0 ${viewSize} ${viewSize}">
		<rect width="100%" height="100%" fill="${color}"/>
		<text x="50%" y="50%" dy="0.36em" text-anchor="middle" pointer-events="none"
				fill="#ffffff" font-family="'Helvetica','Arial','Lucida Grande','sans-serif'"
				font-size="${fontSize}">
			${initials}
		</text>
	</svg>`;
};

export const pageSize = (): number | null => {
  const savedPaginationSize = localStorage.getItem('pagination:size');

  if (savedPaginationSize === 'dynamic') {
    localStorage.setItem('pagination:size', 'dynamic');
    return null;
  }

  return Number(savedPaginationSize);
};
