export default (name: string) => {
    const twoFirstNames = name.split(" ");
    const firstName = twoFirstNames[0];
    const lastName = twoFirstNames[1];
    let result = `https://ui-avatars.com/api/?background=2081ba&color=fff&name=${firstName}`;
    if (lastName) result = `${result}+${lastName}`;
    return result;
};
