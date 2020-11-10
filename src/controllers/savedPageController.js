import axios from "axios";
import Handlebars from "handlebars";

export default function savedPageController() {
  axios
  .get("templates/savedPage.hbs")
  .then((response) => {
    return render(response.data);
  });

  function render(templateHtml) {
    const templateFunc = Handlebars.compile(templateHtml);

    document
    .getElementById("root")
    .innerHTML = templateFunc();
  }
}