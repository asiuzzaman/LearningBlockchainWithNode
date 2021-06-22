const {Block, Transaction, Blockchain} = require("./index");

const EC = require('elliptic').ec;
var ec = new EC('secp256k1');

// Generate keys
const key = ec.genKeyPair();
const privateKey = key.getPrivate("hex");
const walletNumber = key.getPublic("hex");


const myCoin = new Blockchain();

const tx1 = new Transaction(walletNumber,"randomAddress",100);

tx1.signTransaction(key);
myCoin.addTransaction(tx1);
myCoin.minePendingTransaction(walletNumber);
console.log(myCoin.getBalanceOfAddress(walletNumber));

myCoin.minePendingTransaction(walletNumber);
console.log(myCoin.getBalanceOfAddress(walletNumber));

myCoin.chain[1].transaction[1] = "HackedBlockchain";

console.log(myCoin.isBlockchainValid());
