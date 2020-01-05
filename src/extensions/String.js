Object.defineProperty(String.prototype, "getFirstWord", {
    value: function getFirstWord() {
        return this.split(' ')[0];
    },
    writable: true,
    configurable: true
});

Object.defineProperty(String.prototype, "isWhitespace", {
    value: function isWHitespace() {
        return !/\S/.test(this)
    },
    writable: true,
    configurable: true
})