module.exports = function getCorrectMonth(month) {
    month = month + 1;
    return ('0' + month).slice(-2);
}
