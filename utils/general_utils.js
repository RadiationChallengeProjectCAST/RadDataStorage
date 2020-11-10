function getRandomInt(min, max) {
    const intMin = Math.ceil(min);
    const intMax = Math.floor(max);
    return Math.floor(Math.random() * (intMax - intMin + 1)) + intMin;
}

exports.getRandomInt = getRandomInt;
