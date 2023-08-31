//var defUrl = "wss://msb.eastus.cloudapp.azure.com:1880/ws/signage";
var defUrl = "ws://10.198.0.132:1880/ws/signage";


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


async function save_options() {

	var screenId = document.getElementById("screen");
	var server = document.getElementById("server");

	await save("screen",screenId.value);
	await save("server",server.value);

	status.innerHTML = "Options Saved.";
	setTimeout(function() {
		status.innerHTML = "";
	}, 750);
}

async function restore_options() {

	screenId= await load("screen") || "1";
	server= await load("server") || defUrl;

	document.getElementById('server').value = server;
	document.getElementById('screen').value = screenId;

}

document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click', save_options);
	restore_options();
});
