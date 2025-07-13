const pageTitle = "Word-Grid Master";
// create an object that maps the url to the template, title, and description
const routes = {
	404: {
		template: "./templates/404.html",
		title: pageTitle + ' | 404',
		description: "Page not found",
	},
	"/": {
		template: "./templates/getStarted.html",
		title: pageTitle,
		description: "This is the Start page",
		script: "js/getStarted.js"
	},
	"/home": {
		template: "./templates/home.html",
		title: pageTitle + ' | home',
		description: "This is the home page",
		script: "js/home.js"
	},
	"/register": {
		template: "templates/register.html",
		title: pageTitle + ' | register',
		description: "This is the register page",
		script: "js/register.js",
	},
	"/login": {
		template: "./templates/login.html",
		title: pageTitle + ' | login',
		description: "This is the login page",
		script: "js/login.js",
	},
	"/leaderboard": {
		template: "./templates/leaderboard.html",
		title: pageTitle + ' | leaderboard',
		description: "This is the leaderboard page",
		script: "js/leaderboard.js",
	},
	"/profile": {
		template: "./templates/profile.html",
		title: pageTitle + ' | profile',
		description: "This is the profile page",
		script: "js/profile.js"
	},
	"/level/:id":{
		template: "./templates/level.html",
		title: pageTitle + ' | level',
		description: "This is the level page",
		script: "js/level.js"
	}
};


const locationHandler = async () => {
	
	var location = window.location.hash.replace("#", "");
	
	if (location.length == 0) {
		location = "/";
	}
	
	// const route = routes[location] || routes["404"];
	let route = routes[location];

	if(!route){
		const levelMatch = location.match(/^\/level\/(\d+)$/);
		if(levelMatch){
			window.currentLevelId = levelMatch[1];
			route = routes['/level/:id']
		}
		else route = routes["404"]
	}
	
	const html = await fetch(route.template).then((response) => response.text());
	
	document.getElementById("content").innerHTML = html;
	
	document.title = route.title;
	
	document
		.querySelector('meta[name="description"]')
		.setAttribute("content", route.description);

	const existingScript = document.getElementById("dynamic-route-script");
  if (existingScript) existingScript.remove();

  if (route.script) {
    const script = document.createElement("script");
    script.src = route.script;
    script.type = "text/javascript";
    script.id = "dynamic-route-script";
    document.body.appendChild(script);
  }

};

window.addEventListener("hashchange", locationHandler);

locationHandler();

console.log("Router script loaded");
