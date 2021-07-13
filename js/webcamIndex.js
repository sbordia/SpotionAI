
navigator.permissions.query({name: 'camera'})
.then((permission) => {
    console.log("camera state", permission.state);
}).catch((error) => {
    console.log('Got error :', error);
})

let usePicButton = document.getElementById("submit-pic");
let dataStr;

Webcam.set({
    width: 320,
    height: 240,
    image_format: 'jpg',
    jpeg_quality: 100
});

Webcam.attach('#my_camera');

console.log('cnfirm')


document.getElementById("snap").addEventListener('click', () => {
    Webcam.snap(function (data_uri) {
        dataStr = data_uri;
        // display results in page
        document.getElementById('preview').innerHTML = '<img src="' + data_uri + '"/>';

        document.getElementById('preview').classList.remove('hidden')

        document.getElementById('submit-pic').classList.remove("hidden")
        

    });


})

usePicButton.addEventListener('click', () => {
    spinner.classList.remove('hidden');
    getResults(dataStr);
})

function getResults(data_uri) {
    const parts = data_uri.split(';base64,');

        const options = {
            method: "POST",
            body: parts[1],
            headers: {
                "type": "base64"
            }
        }

        // console.log(data_uri)
        fetch("https://emotionreader.azurewebsites.net/api/emotionReader?code=Fg2VdkVVKGd8J5aj4P8RhkI1Myab7mSQa69ausJD90Qph9rtqxLoSA==", options)
            .then(resp => resp.json())
            .then(data => {

                const emotion = manipulateEmotion(data.emotion)
                if (!(emotion === "We could not detect a face!")) {
                    const playlistUrl = getPlaylistUrls(emotion)
                    const songUrl = getSongUrl(emotion)
                }
                

                results.classList.remove('hidden');
                

                document.getElementById("emotion").innerHTML = data.emotion;
                
                spinner.classList.add("hidden");

                scrollTo("anchor")

            })
}


function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
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
        setPlaylistIframe(embedUrl, "playlistIframe");
    });

}


function randomItem(items) {
    var item = items[Math.floor(Math.random() * items.length)];
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

