import searchPageController from "./controllers/searchPageController";

const routes = {
  "/search": searchPageController
};

function setRoute() {
  // Before activating the routing, let's check for Spotify access token
  var tokenRegex = /access_token=(.+)&token_type=Bearer/;
  console.log(tokenRegex);
  var hashMatches = window.location.hash.match(tokenRegex);
  console.log(hashMatches);

  if (hashMatches && hashMatches[1]) {
    // Set the token to localStorage to use later
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
    window.localStorage.setItem("authToken", hashMatches[1]);
  }

  const currentRoute = window
  .location
  .hash
  .split("#")[1];

  for (let route in routes) {
    if (currentRoute === route) {
      return routes[route]();
    }
  }

  // If nothing matches, trigger the search route
  window.location.hash = "/search";
}

// Trigger the function on page load
document.addEventListener("DOMContentLoaded", setRoute);
// Trigger the function when the hash changes
window.addEventListener("hashchange", setRoute);