function utf8_encoding(str) {
    const length = str.length;
    let arr = [];
    for (let i = 0; i < length; i++) {
        let cp = str.codePointAt(i);
        let b = cp.toString(2);
        let res = '';
        switch (true) {
            case (cp <= 127):
                res = b;
                break;
            case (cp <= 2047):
                b = b.length < 11 ? b.addZero(11 - b.length) : b;
                res = `110${b.slice(0, 5)}10${b.slice(5)}`;
                arr.push(res);
                break;
            case (cp <= 65535):
                b = b.length < 16 ? b.addZero(16 - b.length) : b;
                res = `1110${b.slice(0, 4)}10${b.slice(4, 10)}10${b.slice(10)}`;
                break;
            case (cp > 65535):
                b = b.length < 21 ? b.addZero(21 - b.length) : b;
                res = `11110${b.slice(0, 3)}10${b.slice(3, 9)}10${b.slice(9, 15)}10${b.slice(15)}`;
                break;
        }
        arr.push('0x' + parseInt(res, 2).toString(16).toUpperCase());
    }
    return arr.join();
}

String.prototype.addZero = function (num) {
    let str = '';
    for (let i = 0; i < num; i++) {
        str += '0';
    }
    return str += this;
}
