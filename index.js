const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded());


// * function for webscraping the career profile and turning found data into json
function webScrape(userinput) {
  // * gets userinput from mini website
  let PlayerTag = userinput;
  const url = `https://overwatch.blizzard.com/en-us/career/${PlayerTag}/`;

  // * gets data from webscraper and makes it into JSON
  const PlayerData = [];
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(url);

      // username
      $(".Profile-player--name", html).each(function () {
        const username = $(this).text();

        PlayerData.push({
          username,
        });
      });

      // title
      $(".Profile-player--title", html).each(function () {
        const title = $(this).text();
        PlayerData.push({
          title,
        });
      });

      // rank
      $(".Profile-playerSummary--rank", html).each(function () {
        const img = $(this).attr("src");
        const tiers = [1, 2, 3, 4, 5];
        const metal = [
          "Bronze",
          "Silver",
          "Gold",
          "Platinum",
          "Diamond",
          "Master",
          "Grandmaster",
        ];
        const roles = ["tank", "damage", "support"];
        let rank = ``;

        // * loops to check rank from image name
        for (let x = 0; x <= 6; x++) {
          for (let i = 0; i <= 4; i++) {
            if (img.includes(`${metal[x]}Tier-${tiers[i]}`)) {
              rank = `${metal[x]} ${i + 1}`;
            }
          }
        }
        PlayerData.push({
          rank,
          img,
        });
      });

      console.log(PlayerData);
    })
    .catch((err) => console.log(err));
}
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/action", (req, res) => {
  userinput = req.body.username;
  console.log(userinput);
  webScrape(userinput);
});
