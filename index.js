#!/usr/bin/env node

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const [,, command, ...args] = process.argv;

rl.question('Hello, Who are you? ', (val) => {
    console.log(`Hello ${val}!`);
    rl.close();
})
