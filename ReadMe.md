# Spotify API Application

For this project we will be converting our application to a Single Page Application (SPA) that uses the Spotify API to add discovered tracks to a user's saved tracks.

## Project Expectations

Main Functionality (Required):

- The application should first allow the user to enter a search query and see a list of results populated. [(see search endpoint)](https://developer.spotify.com/web-api/search-item/)
- The app should also allow the user to log into Spotify with their credentials. [(see authorization docs)](https://developer.spotify.com/web-api/authorization-guide/)
- The app should allow the user to save a track to their saved list and see all of their saves on the saved.html template. [(see library endpoints)](https://developer.spotify.com/web-api/library-endpoints/)
- Since you will be modifying the user's account, you will need additional scoped permissions (user-library-read user-library-modify).
- You can [read more about scoped permissions here](https://developer.spotify.com/web-api/using-scopes/).

Bonus:

- Allow user to remove saved tracks

## Josh's Spotify App

Tools used:

- Single Page Application (Pure Javascript )
  - custom routes and components
- [Spotify API](https://developers.spotify.com) (3rd Party Public API)
  - authenticated via Oauth
  - scoped requests
- [Axios](https://github.com/axios/axios) (Promise based HTTP client)
- [Handlebars](https://handlebarsjs.com/) (Javascript Template Engine)
- [Bootstrap](https://getbootstrap.com) (Front end Framework)
- [Font Awesome](https://fontawesome.com/) (Icon library)

### Search for Songs by Title

On search, app makes a `.get` to the Spotify API to grab 20 songs based on the search query, inserting them into cards via handlebars, on the index view.

### Save a Track

When user saves track. It makes a `.put` request passing in the song id.

### View Saved Tracks

User can navigate to `/saved` to find their tracks. Using a `.get` to grab and display their saved tracks.

### Delete a saved Track (Bonus)

When edit icon is clicked. Edit form modal opens. `.get` request grabs all data from API and pre-populates form of respective card. Upon submission: updated data is passed to API via `.put` request.

## Challenges

1.  Was able to grab related artist info, but would display all sets in one song card.
