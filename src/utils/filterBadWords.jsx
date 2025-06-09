const badWords = ['幹', '靠北', '機掰', '白癡', '死', '王八', '智障'];

export function filterAndLimitNotes(input, maxLength = 50) {
  if (!input) return { text: '', modified: false };

  let filtered = input;
  let modified = false;

  badWords.forEach((word) => {
    const regex = new RegExp(word, 'gi');
    if (regex.test(filtered)) {
      filtered = filtered.replace(regex, '***');
      modified = true;
    }
  });

  if (filtered.length > maxLength) {
    filtered = filtered.slice(0, maxLength);
    modified = true;
  }

  return { text: filtered, modified };
}