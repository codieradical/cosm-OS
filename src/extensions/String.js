Object.defineProperty(String.prototype, "getFirstWord", {
    value: function getFirstWord() {
        return this.split(' ')[0];
    },
    writable: true,
    configurable: true
});