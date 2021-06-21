const sha256 = require('crypto-js/sha256');
class Block{
    constructor(timestamp,transaction,previousHash = ""){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    mineBlock(difficulty){

        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0") ){

            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Mining Done: "+this.hash);
    }
    calculateHash(){
        return sha256(
            this.timestamp +
             JSON.stringify(this.transaction) + 
             this.nonce +
             this.previousHash
             ).toString();
    }

}

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.generateGenesisBlock()];
       // this.chain.push();
       this.difficulty = 4;
       this.pendingTransaction = [];
    }

    generateGenesisBlock(){
        return new Block("2021-06-21","GENESIS","0000");
    }
    getLatestBlock(){
        let lengthOfChain = this.chain.length;
        // Return Last element of chain
        return this.chain[lengthOfChain-1];
    }

    createTransaction(transaction){
        this.pendingTransaction.push(transaction);
    }


    minePendingTransaction(){
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransaction = [];
    }

  

    isBlockchainValid(){

        for(let i = 1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) return false;
            if(currentBlock.previousHash !== previousBlock.hash) return false;
        }

        return true;
    }

    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain){
            for(const trans of block.transaction){
                if(trans.fromAddress === address){
                    balance-=trans.amount;
                }else if(trans.toAddress === address){
                    balance+=trans.amount;
                }
            }
        }
        return balance;
    }
}

const myCoin = new Blockchain();

myCoin.createTransaction(new Transaction("address1","address2",100));
console.log(myCoin.getBalanceOfAddress("address1"));
myCoin.createTransaction(new Transaction("address2","address1",50));
console.log(myCoin.getBalanceOfAddress("address2"));
myCoin.createTransaction(new Transaction("address2","bholahat",50));
myCoin.minePendingTransaction();

let balanceOfAddress1 = myCoin.getBalanceOfAddress("address1");

let balanceOfAddress2 = myCoin.getBalanceOfAddress("address2");
let balanceOfBholahat = myCoin.getBalanceOfAddress("bholahat");

console.log(balanceOfAddress1,balanceOfAddress2,balanceOfBholahat); // return false;