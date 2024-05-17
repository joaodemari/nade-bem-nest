export default ({
    thisOne,
    containsThis,
}: {
    thisOne: string;
    containsThis: string;
}) => {
    // Remove accents and convert to lowercase
    const thisOneNormalized = thisOne
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const containsThisNormalized = containsThis
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    // Check if the normalized string contains the substring "joao"
    return thisOneNormalized.includes(containsThisNormalized);
};
