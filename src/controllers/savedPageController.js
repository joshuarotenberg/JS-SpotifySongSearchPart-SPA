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

        document
        .querySelector(".remove-button")
        .addEventListener("click", function(e) {

          const config = {
            method: 'delete',
            url: 'https://api.spotify.com/v1/me/tracks?ids=' + e.target.id,
            headers: { 
              'Authorization': 'Bearer ' + window.localStorage.getItem("authToken")
            }
          };
          
          axios(config)
          .then(function (response) {
            axios
            .get("templates/savedPage.hbs")
            .then((savedPageResponse) => {
              axios
              .get("templates/savedResult.hbs")
              .then((savedResultResponse) => {
                return render(savedPageResponse.data, savedResultResponse.data);
              });
            });
            console.log(JSON.stringify(response.data));

            // display alert that song was removed and then hide alert
            
            window.scrollTo({ top: 0, behavior: 'smooth' });

            document.getElementById("alert").innerHTML = `
              <div class="alert alert-success alert-dismissible fade show" role="alert">
              <strong>Holy guacamole!</strong> That song was removed successfully.
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            `
            
          setTimeout(function(){
                document.getElementById("alert").remove();
           }, 2000);//wait 2 seconds
          })
          .catch(function (error) {
            console.log(error);
          });

        });
    })
    .catch(function(err) {
        console.log(err);
    });

    
  }
}