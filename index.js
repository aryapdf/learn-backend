#!/usr/bin/env node

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const [,, command, ...args] = process.argv;

async function callEvents(user) {
    try {
        const response = await fetch(`https://api.github.com/users/${user}/events`);

        if (!response.ok) {
            if (response.status === 404) {
               return 'USER_NOT_FOUND'
            } else {
                return `${response.status} ${response.statusText}`
            }
        }


        const data =  await response.json();

        if (data.length === 0) {
            return 'NO_ACTIVITY'
        }
        return data.map((eachData) => ({
            id: eachData.id,
            type: eachData.type,
            name: eachData.actor.display_login,
            repo_name: eachData.repo.name,
        }));
    } catch(e) {
        return `${e.code} ${e.message}`
    }


}

rl.question('Hello, Who are you? ', async (val) => {
    if (!val.trim()) {
        console.log(`You didn't input the user correctly. Try again.`)
        rl.close();
    }

    console.log(`Hello ${val}!`);
    console.log(`Fetching your data... \n`);

    try {
        const response = await callEvents(val);
        if (typeof response !== 'object') {
            switch (response) {
                case 'USER_NOT_FOUND':
                    console.log("User not found.. did you insert the correct username?")
                    console.log("Try again.")
                    break;
                case 'NO_ACTIVITY':
                    console.log("It seems this user not active for a while...")
                    console.log("No activity recorded.")
                    break;
                default:
                    console.log('Something went wrong...');
                    console.log(`Error: ${e}`);
            }
        } else {
            console.log('Github User Activity\n')

            const grouped = {}

            response.forEach(event => {
                const key = `${event.type}-${event.name}`
                if (!grouped[key]) {
                    grouped[key] = {...event, count: 1};
                } else {
                    grouped[key].count++
                }
            })

            Object.values(grouped).forEach(eachData => {
                if (eachData.type === 'PushEvent') {
                    console.log(`- Pushed ${eachData.count > 1 ? eachData.count + ' Commits' : 'a Commit'} to ${eachData.repo_name}\n`)
                }
                if (eachData.type === 'CreateEvent') {
                    console.log(`- Just created ${eachData.count > 1 ? eachData.count + ' Events' : 'an Event'} in ${eachData.repo_name}\n`)
                }
                if (eachData.type === 'WatchEvent') {
                    console.log(`- Watching ${eachData.repo_name}... ${eachData.count > 1 ? "(" + eachData.count + " times)" : ''}\n`)
                }
            })
        }
    } catch (e) {
        throw new Error(e)
    } finally {
        rl.close();
    }
})
