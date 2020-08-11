let search = function(){
	let curWinCheckInput = document.getElementById("current-window-check");
	let queryInput = document.getElementById("query");
	let searchTypeInput =  document.getElementById("search-type");
	let selectedOption = searchTypeInput.options[searchTypeInput.selectedIndex];

	if(selectedOption == undefined) return;

	let query = queryInput.value.toLowerCase();
	let options = {};
	if(curWinCheckInput.checked){
		options['currentWindow'] = curWinCheckInput.checked;
	}
	chrome.tabs.query(options, function(tabs){
		let searchResultUl = document.getElementById("search-result");
		searchResultUl.innerHTML = "";
		let resultTabs = tabs;
		if(searchTypeInput.value == "all"){
			resultTabs = resultTabs.filter(x => {
				return x.url.toLowerCase().indexOf(query) > -1 ||
					x.title.toLowerCase().indexOf(query) > -1;
			});
		}else if(searchTypeInput.value == "url"){
			resultTabs = resultTabs.filter(x => {
				return x.url.toLowerCase().indexOf(query) > -1;
			});
		}else if(searchTypeInput.value == "title"){
			resultTabs = resultTabs.filter(x => {
				return x.title.toLowerCase().indexOf(query) > -1;
			});
		}else{
			console.log("Unknown search type.")
			return;
		}

		resultTabs.forEach((x, i) => {
			let li = document.createElement("li");

			let chk = document.createElement("input");
			let label = document.createElement("label");
			label.htmlFor = x.id;
			label.innerText = x.title;

			chk.type = "checkbox"
			chk.className = "chk";
			chk.id = x.id;

			li.appendChild(chk);
			li.appendChild(label);
			searchResultUl.appendChild(li);
		});
	});
}

document.getElementById("search-submit").onclick = search;

let targetIds = function(){
	let chks = document.getElementsByClassName("chk");
	let ids = [];
	for(let n of chks){
		if(n.checked){
			ids.push(parseInt(n.id));
		}
	}
	return ids;
}

let remove = function(){
	let ids = targetIds();
	if(ids.length <= 0){
		console.log("no targets");
		return;
	}
	chrome.tabs.remove(ids, function(){});
	setTimeout(() => {
        search();
    }, 2000);
}
document.getElementById("btn-remove").onclick = remove;

let newWindow = function(){
	let ids = targetIds();
	if(ids.length <= 0){
		console.log("no targets");
		return;
	}
	chrome.windows.create({state: "fullscreen"}, function(w){
		chrome.tabs.move(ids, {windowId: w.id, index: -1}, function(t){});
	});
	setTimeout(() => {
        search();
    }, 2000);
}
document.getElementById("btn-new-window").onclick = newWindow;

let allInversionCheck = function(){
	let chks = document.getElementsByClassName("chk");
	let flg = true;
	for(let n of chks){
		flg = flg && n.checked;
	}
	for(let n of chks){
		n.checked = !flg;
	}
}

document.getElementById("btn-all-check").onclick = allInversionCheck;
