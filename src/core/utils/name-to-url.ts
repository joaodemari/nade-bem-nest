function nameToUrl(name: string): string {
  return name
    .toLowerCase()
    .replace(/ã/g, 'a')
    .replace(/õ/g, 'o')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/~/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default nameToUrl;
