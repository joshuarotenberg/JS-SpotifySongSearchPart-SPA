import axios from "axios";
import Handlebars from "handlebars";

export default function searchPageController() {
  axios
  .get("templates/searchPage.hbs")
  .then((searchPageResponse) => {
    axios
    .get("templates/searchResult.hbs")
    .then((searchResultResponse) => {
      axios
      .get("templates/relatedResult.hbs")
      .then((relatedResultResponse) => {
        return render(searchPageResponse.data, searchResultResponse.data, relatedResultResponse.data);

      });
    });
    
  });

  function render(searchPageTemplateHtml, searchResultTemplateHtml, relatedResultTemplateHtml) {
    const searchPageTemplateFunc = Handlebars.compile(searchPageTemplateHtml);
    const searchResultTemplateFunc = Handlebars.compile(searchResultTemplateHtml);
    const relatedResultTemplateFunc = Handlebars.compile(relatedResultTemplateHtml);

    
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
            const songs = response.data.tracks.items;

            console.log(songs);

            songs.forEach(function(song) {
                songCard.innerHTML += searchResultTemplateFunc({
                    id: song.id,
                    song_name: song.name,
                    artist: song.artists[0].name,
                    artist_id: song.artists[0].id,
                    album: song.album.name,
                    preview_url: song.preview_url,
                    album_image: song.album.images[1].url,   
                    popularity: song.popularity  
                });

                axios
                .get(`https://api.spotify.com/v1/artists/${song.artists[0].id}/related-artists`, {
                  headers: {
                    "Authorization": "Bearer " + authToken
                  }
                })
                .then(function(response) {
                  // const relatedCard = document.getElementById("related-index");
                  // const relatedArtists = response.data.artists;
                  // const related = relatedArtists.splice(0,3);

                  // console.log(related);

                  // related.forEach(function(rel) {
                  //   relatedCard.innerHTML += relatedResultTemplateFunc ({
                  //     related_artist_name: rel.name,
                  //     related_artist_image: rel.images[0].url
                  //   });
                  // });
                   
                })
                .catch(function(err) {
                  console.log(err);
                })
            })

            

            document
            .querySelector(".save-button")
            .addEventListener("click", function(e) {

              const config = {
                method: 'put',
                url: 'https://api.spotify.com/v1/me/tracks?ids=' + e.target.id,
                headers: { 
                  'Authorization': 'Bearer ' + window.localStorage.getItem("authToken")
                }
              };
              
              axios(config)
              .then(function (response) {
                console.log(JSON.stringify(response.data));

                // alert that song was saved with link to /saved

                window.scrollTo({ top: 0, behavior: 'smooth' });

                document.getElementById("alert").innerHTML = `
                  <div class="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Holy guacamole!</strong> That song was saved. Check out your <a href="#/saved">saved songs</a>.
                  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                `
                setTimeout(function(){
                  document.getElementById("alert").remove();
                  }, 7000);//wait 7 seconds
              })
              .catch(function (error) {
                console.log(error);
              });

                
            });
        })
        .catch(function(err) {
            console.log(err);
        });

        

    });

  }
}