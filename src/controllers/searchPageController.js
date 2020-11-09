import axios from "axios";
import Handlebars from "handlebars";

export default function searchPageController() {
    axios
    .get('templates/searchPage.hbs')
    .then((searchPageResponse) => {
        axios
        .get('templates/searchResult.hbs')
        .then((searchResultResponse) => {
            return render(searchPageResponse.data, searchResultResponse.data);
          });
    });

    
}