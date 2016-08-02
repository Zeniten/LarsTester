const indicator = (c1, c2) => {
    if (c1 === c2) {
        return 0;
    }
    return 1;
};

export const ineffectiveLevenshtein = (s1, s2) => {
    // console.log("s1: " + s1);
    // console.log("s2: " + s2);
    var l1 = s1.length;
    var l2 = s2.length;

    if (Math.min(l1, l2) === 0) {
        return Math.max(l1, l2);
    }

    return Math.min(ineffectiveLevenshtein(s1.substring(0, l1 - 1), s2) + 1,
             ineffectiveLevenshtein(s1, s2.substring(0, l2 - 1)) + 1,
             ineffectiveLevenshtein(s1.substring(0, l1 - 1), s2.substring(0, l2 - 1)) + indicator(s1[l1 - 1], s2[l2 - 1]));
};

export { ineffectiveLevenshtein };