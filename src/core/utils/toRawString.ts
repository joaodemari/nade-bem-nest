export default (input?: string) => {
  // Trim the input string and convert it to lowercase
  input = input ?? "";
  const trimmedLowerCase = input.trim().toLowerCase();

  return trimmedLowerCase;
};
