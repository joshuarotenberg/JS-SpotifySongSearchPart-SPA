import axios from "axios";
import Handlebars from "handlebars";

export default function savedPageController() {
  axios
  .get("templates/savedPage.hbs")
  .then((savedPageResponse) => {
    axios
    .get("templates/savedResult.hbs")
    .then((savedResultResponse) => {
      return render(savedPageResponse.data, savedResultResponse.data);
    });
  });

  function render(savedPageTemplateHtml, savedResultTemplateHtml) {
    const savedPageTemplateFunc = Handlebars.compile(savedPageTemplateHtml);
    const savedResultTemplateFunc = Handlebars.compile(savedResultTemplateHtml);

    document
    .getElementById("root")
    .innerHTML = savedPageTemplateFunc();

    const savedSongCard = document.getElementById("saved-song-index");

    const authToken = window.localStorage.getItem("authToken");


    // If auth token is not saved to localStorage, don't allow Axios request
    if (!authToken) {
      return;
    }

    axios
    .get("https://api.spotify.com/v1/me/tracks", {
      headers: {
        "Authorization": "Bearer " + authToken
      }
    })
    .then(function(response) {
    const savedTracks = response.data.items;

    console.log(savedTracks);

    savedTracks.forEach(function(song) {
            savedSongCard.innerHTML += savedResultTemplateFunc({
                id: song.track.id,
                song_name: song.track.name,
                artist: song.track.artists[0].name,
                album: song.track.album.name,
                preview_url: song.track.preview_url,
                album_image: song.track.album.images[1].url,   
                popularity: song.track.popularity  
            });
        })
    })
    .catch(function(err) {
        console.log(err);
    });

  }
}