import axios from "axios";
import Handlebars from "handlebars";

export default function searchPageController() {
  axios
  .get("templates/searchPage.hbs")
  .then((searchPageResponse) => {
    axios
    .get("templates/searchResult.hbs")
    .then((searchResultResponse) => {
      return render(searchPageResponse.data, searchResultResponse.data);
    });
  });

  function render(searchPageTemplateHtml, searchResultTemplateHtml) {
    const searchPageTemplateFunc = Handlebars.compile(searchPageTemplateHtml);
    const searchResultTemplateFunc = Handlebars.compile(searchResultTemplateHtml);

    
    document
    .getElementById("root")
    .innerHTML = searchPageTemplateFunc();

    // Container that completed Handlebars template HTML will go into
    const songCard = document.getElementById("song-index");

   
    document
    .getElementById("find-song")
    .addEventListener("submit", function(e) {
        e.preventDefault();
        console.log("search song form submission");

        const authToken = window.localStorage.getItem("authToken");


        // If auth token is not saved to localStorage, don't allow Axios request
        if (!authToken) {
          return;
        }

        axios
        .get("https://api.spotify.com/v1/search", {
          params: {
            q: document.getElementById("song-query").value,
            type: "track"
          },
          headers: {
            "Authorization": "Bearer " + authToken
          }
        })
        .then(function(response) {
        var songs = response.data.tracks.items;

            songs.forEach(function(song) {
                songCard.innerHTML += searchResultTemplateFunc({
                    id: song.id,
                    song_name: song.name,
                    artist: song.artists[0].name,
                    album: song.album.name,
                    preview_url: song.preview_url,
                    album_image: song.album.images[1].url,   
                    popularity: song.popularity  
                });
            })
        })
        .catch(function(err) {
            console.log(err);
        });

        

    });

  }
}