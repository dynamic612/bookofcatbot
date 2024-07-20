// The URL you want to send the request to
const url = 'https://demo.bgaming-network.com/api/BookOfCats/197026/12f2c096-2c3f-4ed1-abe6-b2e3943072be';

//endtime(month/day/year/-hours-mins)
const endtime = "1/25/2024-14-44";

const axios = require('axios');

//commands
const initb = {
    "command": "init",
    "options": {
        "balance": true
    }
}
const init = {
    "command": "init"
}

const finish = {
    "command": "finish"
}
const spin = {
    "command": "spin",
    "options": {
        "bets": {
            "0": 1,
            "1": 1,
            "2": 1,
            "3": 1,
            "4": 1,
            "5": 1,
            "6": 1,
            "7": 1,
            "8": 1,
            "9": 1
        }
    }
}

// letter color
const blue = '\x1b[36m%s\x1b[0m';
const red = '\x1b[31m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';

// Send a pre post request
axios.post(url, init);
axios.post(url, finish);

//main function
async function sendPostRequest(action) {

    const realtime = new Date();
    const dateNow = realtime.toLocaleDateString()
    const time = realtime.getHours();
    const min = realtime.getMinutes();
    const timeNow = (dateNow + "-" + time + "-" + min).toString();
    if (endtime === timeNow ) {
        console.log("Game is ened at ", timeNow);
        process.exit();
    }
        axios.post(url, action)
            .then(res => {
                if (res.data.errors === undefined) {
                    if (res.data.available_commands.includes("spin") && res.data.game.state.includes("closed")) {

                        setTimeout(() => {
                            sendPostRequest(spin)
                        }, 200);

                        console.log(blue, "<----------------Balance---------------->" + " : ", res.data.balance / 100);

                    } else if (res.data.available_commands.includes("finish")) {

                        setTimeout(() => {
                            sendPostRequest(finish);
                            axios.post(url, initb);
                        }, 200);

                    } else if (res.data.game.state == "freespin") {

                        console.log(green, "<----------------freespin--------------->" + " : ", res.data.game.freespins_left);
                        console.log(blue, "<----------------Balance---------------->" + " : ", res.data.balance / 100);

                        setTimeout(() => {
                            sendPostRequest(spin);
                        }, 1000);

                    }
                } else {

                    setTimeout(() => {
                        sendPostRequest(init);
                    }, 200);
                    console.log(red, " <--------------------Error-------------------->  ");

                }
            })
            .catch(error => {

                console.error('Error:', error);
                sendPostRequest(init);

            });

}

setTimeout(() => {
    sendPostRequest(spin);
}, 100);



