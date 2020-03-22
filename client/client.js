const form = document.querySelector("form");
const loadingElement = document.querySelector(".loading");
const errorElement = document.querySelector('.error-message');
const blurbsElement = document.querySelector(".blurbs");
//const API_URL = "http://localhost:5000/blurbs";
const API_URL = window.location.hostname === "localhost" ? "http://localhost:5000/blurbs" : "https://blurb-api.now.sh/blurbs";

loadingElement.style.display = "none";
listAllBlurbs();

form.addEventListener('submit', (event)=>{
	event.preventDefault();
	const formData = new FormData(form);
	const name = formData.get("name");
	const content = formData.get("content");
	
	const blurb = {name, content};
	form.style.display = "none";
	loadingElement.style.display = "";
	
	//submitting info to server
	fetch(API_URL, {
		method: 'POST',
		body: JSON.stringify(blurb),
		headers: {
			"content-type": "application/json"
		}
	}).then(response => response.json())
	  .then(createdBlurb => {
		form.reset();
		setTimeout(() => {
			form.style.display = "";
			loadingElement.style.display = "none";
		}, 10000); //un-hides form after 15 sec
		listAllBlurbs(); //refresh blurbs after new input
	  });
});

//get request
function listAllBlurbs(){
	blurbsElement.innerHTML = ""; //clears the list/removes DOM elements after new input
	fetch(API_URL)
		.then(response => response.json())
		.then(blurbs => {
			console.log(blurbs);
			//put blurbs in reverse order
			blurbs.reverse();
			//iterate over the blurbs, casts to blurb class in index.html
			blurbs.forEach(blurb => {
				const div = document.createElement("div");
				
				const header = document.createElement("h2");
				header.textContent = blurb.name;
				
				const contents = document.createElement("p");
				contents.textContent = blurb.content;
				
				const date = document.createElement("small");
				date.textContent = new Date(blurb.created);
				
				div.appendChild(header);
				div.appendChild(contents);
				div.appendChild(date);
				
				blurbsElement.appendChild(div);
			});
		});
}
