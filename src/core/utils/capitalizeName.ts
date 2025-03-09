export default (input?: string, numberOfCharactersMaximum?: number) => {
  input = input ?? '';

  const names = input.split(' ');

  const capitalizedNames = names
    .map((name) => {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    })
    .join(' ');

  if (numberOfCharactersMaximum) {
    let trimmedNames = capitalizedNames;
    while (trimmedNames.length > numberOfCharactersMaximum) {
      const lastSpaceIndex = trimmedNames.lastIndexOf(' ');
      if (lastSpaceIndex === -1) {
        break;
      }
      trimmedNames = trimmedNames.substring(0, lastSpaceIndex);
    }
    return trimmedNames;
  }

  return capitalizedNames;
};
