let video = document.querySelector("#video");
let captureButton = document.querySelector("#capture-btn");
let resultsDiv = document.querySelector("#emotion-results");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log("Something went wrong!");
    });
} else {
  console.log("getUserMedia not supported on your browser!");
}

captureButton.addEventListener("click", function() {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  let imgData = canvas.toDataURL("image/jpeg"); // Convert image to base64

  // Now you have a frame captured as base64-encoded image
  // You can send this to Azure Face API
  // This is a placeholder, replace with actual API call
  // You need to handle promises, async/await, etc. properly in real code
  fetch(`https://api.azure.com/face/v1.0/detect?returnFaceAttributes=emotion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
  'Ocp-Apim-Subscription-Key': '<your_api_key_here>',
},
body: imgData
}).then(response => response.json())
.then(data => {
  console.log(data); // log the response
  // Do something with the response, e.g., display results in a div
})
.catch(error => console.error('Error:', error));
