//creates get request for profile data
function getStats(url, callback) {

    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            callback(request.responseText);
        } else if (request.status >= 400) {
            notFound();
        }
    }

    request.open("GET", url, true);
    request.send(null);
}

//starts the request for profile data
function startRequest() {

    let user = document.getElementById("user").value;
    let region = document.getElementById("region").value;
    let platform = document.getElementById("platform").value;

    user = user.replace('#', '-');

    let url = "https://ow-api.com/v1/stats/" + platform + "/" + region + "/" + user + "/profile";

    getStats(url, function(response){

            response = JSON.parse(response);
            x = response;

            createStatRoot();

            document.getElementById("name").textContent = response.name;
            document.getElementById("icon").src = response.icon;
            //document.getElementById("icon").style.display = "inline";

            document.getElementById("profile").style.display = "flex";
            makeVisible(document.getElementById("profile"));
            makeVisible(document.getElementById("stats"));

            if(!response.private) {
                document.getElementById("stats").style.justifyContent = "flex-start";
                createStat("rating", response.rating + "SR");

                for (let index = 0; index < response.ratings.length; index++) {
                    const element = response.ratings[index];
                    
                    createStat(element.role, element.level + "SR");
                }

                createStat("games played", response.competitiveStats.games.played);
                createStat("games won", response.competitiveStats.games.won);
                let winRate = Math.trunc(response.competitiveStats.games.won / response.competitiveStats.games.played * 100);
                createStat("win rate", winRate + "%");

            }
            else {
                createStat("Profile is Private")
                document.getElementById("stats").style.justifyContent = "center";
            }

            

    });

}

function makeVisible(element) { 
    element.style.visibility = 'visible';
}

//creates a stat div inside of the stats root div
function createStat(h2, p) {

    var div = document.createElement("div");
    div.className = "stat";

    var para = document.createElement("p");
    para.textContent = p;

    var heading = document.createElement("h2");
    heading.textContent = h2;

    div.appendChild(heading);
    div.appendChild(para);
    
    document.getElementById("stats").appendChild(div);
}

//create div where stats will be displayed
function createStatRoot() {

    document.getElementById("stats").remove();

    let body = document.getElementsByTagName("body")[0];
    let newStats = document.createElement("div");
    newStats.id = "stats";
    body.appendChild(newStats);
}

//show message if profile not found or error occurs
function notFound() {

    createStatRoot();
    createStat("Error", "Profile does not exist or an error happened.")

    document.getElementById("stats").style.justifyContent = "center";

    document.getElementById("profile").style.display = "none";
    makeVisible(document.getElementById("stats"));
}

var x;
