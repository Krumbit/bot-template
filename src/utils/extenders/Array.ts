interface Array<T> {
    asyncForEach(callback: Function): void;
}

Array.prototype.asyncForEach = async function (callback: Function) {
    for (let index = 0; index < this.length; index++) {
        await callback(this[index], index, this);
    }
};