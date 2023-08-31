
const LS = {
  getAllItems: () => chrome.storage.local.get(),
  getItem: async key => (await chrome.storage.local.get(key))[key],
  setItem: (key, val) => chrome.storage.local.set({[key]: val}),
  removeItems: keys => chrome.storage.local.remove(keys),
};

async function save(key,value)
{
	await LS.setItem(key, value);
}

async function load(key)
{
	return LS.getItem(key);
}

function redirect( urlStr, state, tabIndex ){


	chrome.tabs.query({index : 0}, function( tab ) {
		console.log(tab);
		if(tab[tabIndex])
		{
			chrome.tabs.update(tab[tabIndex].id, {url: urlStr });

			page[tabIndex] = urlStr;
			console.log(tabIndex+" "+urlStr);

			if ( state == "fullscreen" || state == "normal"){
				chrome.windows.update(tab[tabIndex].windowId, {state : state });
				pageState[tabIndex] = state;
			}
		}
	});


}

function processResponse( resp ){
	for(key in resp)
	{
		let tab = resp[key];

		let tabIndex = parseInt(tab.tab);
		if(page[tabIndex] != tab.url || pageState[tabIndex] != tab.state)
		{
			redirect ( tab.url, tab.state, tabIndex );
		}
	}
}

async function poll()
{

	let url = ""+server+screenId;

	let response = await fetch(url);

	if(response.ok)
	{
		let data = await response.json();
		processResponse(data);
		setTimeout( poll, 10000 );

	}
	else {
		setTimeout( poll, 10000 );
	}
}

var page = {};
var pageState = {};
var screenId;
var server;
var ws;

async function createOffscreen() {
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['BLOBS'],
    justification: 'keep service worker running',
  }).catch(() => {});
}

chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = e => {
	console.log("keepalive msg");
	try{
		ws.send("keepalive "+screenId);
	}
	catch(e)
	{
		console.log(e);
	}
}; // keepAlive

createOffscreen();


function connect()
{
	ws = new WebSocket(server);

	// Listen for WebSocket messages
	ws.onmessage = function(message){
		const receivedURL = message.data;
		console.log("Received URL:", receivedURL);
		try{
			let msg = JSON.parse(receivedURL);
			console.log(msg);
			let tabIndex = parseInt(msg.tab);
			if(msg.id == screenId )
			{
				redirect ( msg.url, msg.state, tabIndex );
			}
		}
		catch(e)
		{
			console.log(e);
		}
	};

	ws.onerror = function()
	{
		ws.close();
	};

	ws.onclose = function()
	{
		console.log("Close");
		setTimeout(connect, 5000);
	};
}


async function run()
{
	//server = await load("server") || "wss://msb.eastus.cloudapp.azure.com:1880/ws/signage";
	server = await load("server") || "ws://10.198.0.132:1880/ws/signage";
	screenId = await load("screen") || "1";
	console.log("server "+server);
	console.log("screen "+screenId);
	connect();
}
run();
