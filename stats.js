// Category ids
const SKILL_RATING = "skillRating";
const COMPETITIVE = "competitive";
const QUICK_PLAY = "quickPlay";

/**
 * Creates get request for profile data from url
 * @param {string} url 
 * @param {function} callback 
 */
function getStats(url, callback) {

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        } else if (request.status >= 400) {
            notFound();
        }
    }

    request.open("GET", url, true);
    request.send(null);
}

/**
 * Starts the request for profile data
 */
function startRequest() {

    let user = document.getElementById("user").value;
    let region = document.getElementById("region").value;
    let platform = document.getElementById("platform").value;

    user = user.replace('#', '-');

    let url = "https://ow-api.com/v1/stats/" + platform + "/" + region + "/" + user + "/profile";

    getStats(url, function (response) {

        response = JSON.parse(response);
        x = response;

        createStatRoot();

        document.getElementById("name").textContent = response.name;
        document.getElementById("icon").src = response.icon;
        document.getElementById("level").textContent = "Level: " + calcLevel(response);
        document.getElementById("endorsement").textContent = "Endorsement: " + response.endorsement;
        //document.getElementById("icon").style.display = "inline";

        document.getElementById("profile").style.display = "flex";
        makeVisible(document.getElementById("profile"));
        makeVisible(document.getElementById("stats"));

        if (!response.private) {

            //sr and comp stats creation
            if (response.rating != 0) {
                createStatCategory("skill rating", SKILL_RATING);
                createStatCategory("competitive", COMPETITIVE);

                document.getElementById("stats").style.justifyContent = "flex-start";
                createStat("rating", response.rating + "SR", SKILL_RATING);

                for (let index = 0; index < response.ratings.length; index++) {
                    const element = response.ratings[index];

                    createStat(element.role, element.level + "SR", SKILL_RATING);
                }

                fillModeStats(response.competitiveStats, COMPETITIVE);

            }

            //quick play stats creation
            createStatCategory("quick play", QUICK_PLAY);
            fillModeStats(response.quickPlayStats, QUICK_PLAY);

        }
        else {
            createStat("Profile is Private", "", "stats");
            document.getElementById("stats").style.justifyContent = "center";
        }



    });

}

/**
 * Makes an element visible
 * @param {Object} element 
 */
function makeVisible(element) {
    element.style.visibility = 'visible';
}

/**
 * Creates a stat div inside othe stats category div of the given id
 * @param {string} h2 
 * @param {string} p 
 * @param {string} id 
 */
function createStat(h2, p, id) {

    var div = document.createElement("div");
    div.className = "stat";

    var para = document.createElement("p");
    para.textContent = p;

    var heading = document.createElement("h2");
    heading.textContent = h2;

    div.appendChild(heading);
    div.appendChild(para);

    document.getElementById(id).appendChild(div);
}

/**
 * Creates a stat category with a header and id
 * @param {string} h1 
 * @param {string} id 
 */
function createStatCategory(h1, id) {
    var div = document.createElement("div");
    div.className = "category";

    var heading = document.createElement("h1");
    heading.textContent = h1;

    var content = document.createElement("div");
    content.id = id;
    content.className = "noShade";

    div.appendChild(heading);
    div.appendChild(content);

    document.getElementById("stats").appendChild(div);
}

/**
 * Creates a new root div for the stats
 */
function createStatRoot() {

    document.getElementById("stats").remove();

    let body = document.getElementsByTagName("body")[0];
    let newStats = document.createElement("div");
    newStats.id = "stats";
    body.appendChild(newStats);
}

/**
 * Fills the stats div for the given mode
 * @param {Object} mode 
 * @param {string} id 
 */
function fillModeStats(mode, id) {
    createStat("games played", mode.games.played, id);
    createStat("games won", mode.games.won, id);
    let winRate = calcWinRate(mode);
    createStat("win rate", winRate + "%", id);

    //awards
    createStat("cards", mode.awards.cards, id);
    createStat("medals", mode.awards.medals, id);
    createStat("medals gold", mode.awards.medalsGold, id);
    createStat("medals silver", mode.awards.medalsSilver, id);
    createStat("medals bronze", mode.awards.medalsBronze, id);
}

/**
 * Shows message if profile not found or error occurs
 */
function notFound() {

    createStatRoot();
    createStat("Error", "Profile does not exist or an error happened.", "stats")

    document.getElementById("stats").style.justifyContent = "center";

    document.getElementById("profile").style.display = "none";
    makeVisible(document.getElementById("stats"));
}

/**
 * Calculates the level for the profile
 * @param {Object} profile 
 */
function calcLevel(profile) {
    return (profile.prestige * 100) + profile.level;
}

/**
 * Calculates win rate for the given mode
 * @param {Object} mode 
 */
function calcWinRate(mode) {
    return Math.trunc(mode.games.won / mode.games.played * 100);;
}

var x;
