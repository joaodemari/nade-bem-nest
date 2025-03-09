export default (name: string) => {
  const twoFirstNames = name.split(' ');
  const firstName = twoFirstNames[0];
  let result = `https://ui-avatars.com/api/?background=00a1ff&color=fff&name=${firstName}&size=256`;
  const lastName = twoFirstNames[1];
  if (lastName) result = `${result}+${lastName}`;
  return result;
};
