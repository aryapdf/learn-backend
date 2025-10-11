#!/usr/bin/env node

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const [,, command, ...args] = process.argv;

async function callEvents(user) {
    const response = await fetch(`https://api.github.com/users/${user}/events`);
    const data =  await response.json();
    return data.map((eachData) => ({
        id: eachData.id,
        type: eachData.type,
        name: eachData.actor.display_login,
        repo_name: eachData.repo.name,
    }));
}

rl.question('Hello, Who are you? ', (val) => {
    console.log(`Hello ${val}!`);
    console.log(`Fetching your data...`);
    callEvents(val).then((res) => {
        if (res.length === 0) {
            console.log(`The user you look is not available! Try again?`);
        } else {
            console.log(`Github events data : `, res)
        }
    });
    rl.close();
})
