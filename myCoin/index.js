const sha256 = require('crypto-js/sha256');
class Block{
    constructor(timestamp,data,previousHash){
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return sha256(this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }

}
const block = new Block("2021-06-21", {amount: 5}, "ABCE");

console.log(block);