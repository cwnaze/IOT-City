const options = {
    username: "web",
    password: "web"
};

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const url = 'ws://192.168.2.7:8083';

const client = mqtt.connect(url, options);

hasPower = true;

var blackout = false;

client.on('connect', () => {
    console.log("Connected to MQTT Broker");

    // Subscribe to a topic
    client.subscribe('lights/#', (err) => {
        if (!err) console.log("Subscribed to topic");
    });
});

client.on('message', function (topic, message) {
    // message is Buffer
    if(topic == 'lights/red') {
        if(message == 'on') Red(true);
    } else if (topic == 'lights/yellow') {
        if(message == 'on') Yellow(true);
    } else if(topic == 'lights/green') {
        if(message == 'on') Green(true);
    } else if(topic == 'lights/blackout') {
        if(message == 'on') {blackout = true; Blackout();}
        else blackout = false;
    }
    console.log(topic.toString(), message.toString())
  })

function Green(isOn) {
    if(blackout) {alert('该网页已被查封'); return;}
    if(hasPower) {
        if(!isOn) client.publish('lights/green', 'on')
        document.getElementById('green').hidden = false;
        document.getElementById('red').hidden = true;
        document.getElementById('yellow').hidden = true;
        document.getElementById('off').hidden = true;
    }
}

function Yellow(isOn) {
    if(blackout) {alert('该网页已被查封'); return;}
    if(hasPower) {
        if(!isOn) client.publish('lights/yellow', 'on')
        document.getElementById('green').hidden = true;
        document.getElementById('red').hidden = true;
        document.getElementById('yellow').hidden = false;
        document.getElementById('off').hidden = true;
    }
}

function Red(isOn) {
    if(blackout) {alert('该网页已被查封'); return;}
    if(hasPower) {
        if(!isOn) client.publish('lights/red', 'on')
        document.getElementById('green').hidden = true;
        document.getElementById('red').hidden = false;
        document.getElementById('yellow').hidden = true;
        document.getElementById('off').hidden = true;
    }
}

function Power() {
    if(!document.getElementById('switch').checked) {
        hasPower = false;
        client.publish('lights/red', 'off')
        client.publish('lights/green', 'off')
        client.publish('lights/yellow', 'off')
        document.getElementById('green').hidden = true;
        document.getElementById('red').hidden = true;
        document.getElementById('yellow').hidden = true;
        document.getElementById('off').hidden = false;
    } else {
        hasPower = true;
        client.publish('lights/green', 'on')
        document.getElementById('green').hidden = false;
        document.getElementById('red').hidden = true;
        document.getElementById('yellow').hidden = true;
        document.getElementById('off').hidden = true;
    }
}

async function Blackout() {
    while(blackout) {
        document.getElementById('switch').checked = false;
        Power();
        console.log('off')
        await sleep(10000);

        console.log('on')
        document.getElementById('switch').checked = true;
        Power();

        await sleep(2000);

    }
}