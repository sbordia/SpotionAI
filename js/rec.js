let submitButton = document.getElementById('submit-button');
let fileInput = document.getElementById("file-upload");
let spinner = document.querySelector(".spinner");
let results = document.querySelector(".emotionResults");

$('#file-upload').on('change', function() {
    let fileName = $(this).val().split('\\').pop();
    $(this).next('#fileName').addClass("selected").html(fileName);
  });



function getSong(event) {
    event.preventDefault();
    
    spinner.classList.remove('hidden');
    const file = fileInput.files[0];
    var songForm = document.getElementById("songForm") 
    var payload = new FormData(songForm);
    payload.append("file", file)

    const options = {
        method: "POST",
        body: payload,
    }

    fetch("https://emotionreader.azurewebsites.net/api/emotionReader?code=Fg2VdkVVKGd8J5aj4P8RhkI1Myab7mSQa69ausJD90Qph9rtqxLoSA==", options)
        .then(resp => resp.json())
        .then(data => {

            const emotion = manipulateEmotion(data.emotion)

            if (!(emotion === "We could not detect a face!")) {
                const playlistUrl = getPlaylistUrls(emotion)
                const song = getSongUrl(emotion)
            }

            document.getElementById("emotion").innerHTML = data.emotion;
            results.classList.remove('hidden');
            spinner.classList.add("hidden")
            scrollTo("anchor")
            
        })
}


function manipulateEmotion(emotion) {
    let finalEmotion = emotion;
    // contempt, disgust, suprise
    if (emotion === "contempt") {
        finalEmotion = "anger"
    }
    else if (emotion === "surprise") {
        finalEmotion = "neutral"
    }
    else if (emotion === "disgust") {
        finalEmotion = "anger"
    }

    return finalEmotion
}

function getPlaylistUrls(emotion) {
    $.getJSON("songs.json", function (json) {
        const url = randomItem(json[emotion]);
        const embedUrl = createEmbedUrl(url, "playlist");
        setIframe(embedUrl, "playlistIframe");
    });

}

function randomItem(items) {
    var item = items[Math.floor(Math.random()*items.length)]; 
    return item;
}

function createEmbedUrl(url, type) {
    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };

    const index = url.indexOf(type)

    var result = url.splice(index, 0, "embed/");
    return result
}

function setIframe(embedurl, id) {
    document.getElementById(id).src = embedurl
}



function getSongUrl(emotion) {
    $.getJSON("playlists.json", function (json) {
        const url = randomItem(json[emotion]);
        console.log(url)
        const embedUrl = createEmbedUrl(url, "track");
        console.log(embedUrl)
        setIframe(embedUrl, "songIframe");
    });
}


function scrollTo(hash) {
    console.log("scrolling")
    location.hash = "#" + hash;
  }
