export default (input?: string) => {
  input = input ?? "";

  const names = input.split(" ");

  const trimmedLowerCase = names
    .map((name) => {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    })
    .join(" ");

  return trimmedLowerCase;
};
