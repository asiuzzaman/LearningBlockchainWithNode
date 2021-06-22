const sha256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
var ec = new EC('secp256k1');
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

    hasTransactionValid(){

        for(const tx of this.transaction){
            if(!tx.isValid()) return false;
        }

        return true;
    }

}

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return sha256(this.fromAddress + this.toAddress + this.amount);
    }

    signTransaction(key){
        if(key.getPublic("hex") !== this.fromAddress) { // problem 
            throw new Error ( "You don't have access");
        }

        const hashTx = this.calculateHash();

        const signature = key.sign(hashTx,"base64");
        this.signature = signature.toDER();
    }

    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0) {
            throw new Error("No signature found");
        }
        
       const key = ec.keyFromPublic(this.fromAddress,"hex");

      return key.verify(this.calculateHash,this.signature);
    
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.generateGenesisBlock()];
       // this.chain.push();
       this.difficulty = 4;
       this.pendingTransaction = [];
       this.miningReward = 10;
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


    minePendingTransaction(minerAddress){
        let block = new Block(Date.now(), this.pendingTransaction);
        block.mineBlock(this.difficulty);
        this.chain.push(block);
        this.pendingTransaction = [
            new Transaction(null,minerAddress,this.miningReward)
        ];
    }

  

    isBlockchainValid(){

        for(let i = 1; i< this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()) return false;
            if(currentBlock.previousHash !== previousBlock.hash) return false;
            if(!currentBlock.hasTransactionValid()) return false;
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
myCoin.createTransaction(new Transaction("address2","address1",50));

myCoin.minePendingTransaction("asiuzzaman");
console.log(myCoin.getBalanceOfAddress("asiuzzaman"));

myCoin.minePendingTransaction("asiuzzaman");
console.log(myCoin.getBalanceOfAddress("asiuzzaman"));