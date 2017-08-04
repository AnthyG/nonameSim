Math.seed = function(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
};

function interpolationArray(startnum, endnum, spaces) {
    var spaces = spaces - 1,
        arr = [],
        temp = spaces;
    var diff = (startnum > endnum) ? startnum - endnum : endnum - startnum;
    while (arr.length != spaces) {
        var add = Math.round((diff) / temp);
        if (startnum > endnum) {
            arr.push(startnum - add);
            startnum -= add;
        } else {
            arr.push(startnum + add);
            startnum += add;
        }
        temp--;
        diff = diff - add;
    }
    return arr;
}