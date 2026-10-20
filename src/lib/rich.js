const markers = /\*\*([^*]+)\*\*|__([^_]+)__/g;

export function richSegments(value = '') {
  const source = String(value);
  const segments = [];
  let cursor = 0;

  for (const match of source.matchAll(markers)) {
    if (match.index > cursor) {
      segments.push({
        text: source.slice(cursor, match.index),
        bold: false,
        underline: false,
      });
    }

    const bold = match[1] !== undefined;
    segments.push({
      text: match[1] ?? match[2],
      bold,
      underline: !bold,
    });
    cursor = match.index + match[0].length;
  }

  if (cursor < source.length) {
    segments.push({
      text: source.slice(cursor),
      bold: false,
      underline: false,
    });
  }

  return segments;
}

export function plainText(value = '') {
  return String(value).replace(markers, (_, bold, underline) => bold ?? underline);
}
