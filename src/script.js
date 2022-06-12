
const aslModelUrl = "https://teachablemachine.withgoogle.com/models/c86ifOUXo/"
const feedbackRatingUrl = 'https://teachablemachine.withgoogle.com/models/awGMzvVWP/';


let model, webcam, labelContainer, maxPredictions, fbModel, fbMaxPredictions;
let wordCount = 0;
let sentence = ""
let finalOrder = ""
let flag = "order";
let finalRating = 0;
let ratingThreshold = 20;
let ratingArr = []

function mode(arr){
  return arr.sort((a,b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
  ).pop();
}

function beep() {
  var snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
  snd.play();
}

let camera_button = document.querySelector("#start-camera");
let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");
let orderedRight = false;
let uname = document.getElementById("username");

async function getFeedback(webcam) {
  feedbackContainer = document.getElementById("feedback-container");

  window.requestAnimationFrame(loop);
  document.getElementById("webcam-container").appendChild(webcam.canvas);


  for (let i = 0; i < fbMaxPredictions; i++) { // and class labels
    feedbackContainer.appendChild(document.createElement("div"));

  }

}
async function init() {

  let modelURL = aslModelUrl + "model.json";
  let metadataURL = aslModelUrl + "metadata.json";
  let fbModelURL = feedbackRatingUrl + "model.json";
  let fbMetadataURL = feedbackRatingUrl + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  console.log(maxPredictions)

  fbModel = await tmImage.load(fbModelURL, fbMetadataURL);
  fbMaxPredictions = fbModel.getTotalClasses();
  console.log(fbMaxPredictions)


  let flip = false;
  webcam = new tmImage.Webcam(400, 400, flip);
  await webcam.setup();
  await webcam.play();
  textToSpeech("Welcome to Starbucks! Place Your Order Here !");

  // labelContainer = document.getElementById("label-container");

  if (flag == 'order')
    orderPredictor(webcam)
  else
    getFeedback(webcam)

}

let orderPredictor = async (webcam) => {

  wordCount = 0;
  sentence = ""
  // labelContainer = null;
  speechContainer = document.getElementById("speech-container");

  // labelContainer = document.getElementById("label-container");

  speechContainer.innerHTML = sentence;
  document.getElementById("webcam-container").value = null;

  console.log("in order predictor")

  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  // labelContainer = document.getElementById("label-container");
  speechContainer = document.getElementById("speech-container");


  for (let i = 0; i < maxPredictions; i++) { // and class labels
    // labelContainer.appendChild(document.createElement("div"));
    speechContainer.appendChild(document.createElement("div"));
  }

}


async function loop() {
  webcam.update(); // update the webcam frame 
  await predict();
  window.requestAnimationFrame(loop);
}

let getName = (blob) => {

  var form = new FormData();
  form.append("base64Image", blob);
  form.append("language", 'eng');
  form.append("scale", true);
  form.append("apikey", "K84793972288957");

  var settings = {
    "url": "https://api.ocr.space/parse/image",
    "method": "POST",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
  };

  $.ajax(settings).done( async(response)=> {
    response = JSON.parse(response)
    console.log(response)
    let name = response.ParsedResults[0].ParsedText;
    

    console.log(name)
    if (name) {
      uname.innerHTML = "Name : " + name;
      document.getElementById("spinner").style.display = "none"
      document.getElementById("username").style.display = "block"
      document.getElementById("retry-btn").style.display = "block"
      await sleep(3.5 * 1000);
      getUserRatings();
      return name;
    }
    else {

      uname.innerHTML = "Name : - - - - - ";
      document.getElementById("spinner").style.display = "none"
      document.getElementById("username").style.display = "block"
      document.getElementById("retry-btn").style.display = "block"

      textToSpeech("Please try again!")
      console.log("OCR failed. Trying again...")
      flag = 'order';
      startocr();
    }
  });

}


let textToSpeech = (text) => {
  let speech = new SpeechSynthesisUtterance();
  speech.lang = "en";
  speech.text = text;
  window.speechSynthesis.speak(speech);
}

let displayFeedback = async (arr) => {
  finalRating = mode(arr);
  console.log("Final rating is : ", finalRating)
  console.log(arr)
  for(i = 1 ; i<= 5 ; i++){
    (i <= finalRating ) ?  $("#rating").append(`<img src = './images/yellowstar.png' class='star-ratings'/>`) :  $("#rating").append(`<img src = './images/graystar.png' class='star-ratings'/>`);
    document.getElementById("rating").style.display = "block";
  }
  textToSpeech(`You have given us ${finalRating} stars!`)
  textToSpeech("Thank you for your feedback and have a wonderful day!")
  await sleep(10000);
  // location.reload()
}

// run the webcam image through the image model
async function predict() {

  // predict can take in an image, video or canvas html element
  if (flag == 'order') {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      let confidence = prediction[i].probability.toFixed(2);
      let translation = prediction[i].className;
      const classPrediction = translation + ": " + confidence;
      // labelContainer.childNodes[i].innerHTML = classPrediction;


      if (confidence >= 0.93 && !speechContainer.innerHTML.includes(translation) && !orderedRight) {
        if (translation == 'Please') {
          if (wordCount > 2) {
            speechContainer.innerHTML += translation + " ";
            sentence += translation + " ";
            wordCount++;

            if (wordCount >= 4) {
              console.log("SPEAK!!!")
              console.log("The Order is : ", sentence)
              document.getElementById("order_fdbk_btn").style.display = "block"
              textToSpeech(sentence);
             
              await sleep(3000)
              getUsername();
              orderedRight = true;
            }
          }
        } else {
          speechContainer.innerHTML += translation + " ";
          sentence += translation + " ";
          wordCount++;
          console.log(sentence, wordCount)
        }
      }
    }
  }
  else if (flag == 'fb' && !finalRating && ratingArr.length < ratingThreshold) {
    console.log("in feedback")
    let prediction = await fbModel.predict(webcam.canvas);
    for (let i = 0; i < fbMaxPredictions; i++) {
      let confidence = prediction[i].probability.toFixed(2);
      if (confidence >= 0.96) {
        let ratingScore = prediction[i].className;
        ratingArr.push(ratingScore)
        const classPrediction = ratingScore + ": " + confidence;
        console.log(classPrediction,ratingArr);
      }
    }
  }else if( ratingArr.length == ratingThreshold){
    displayFeedback(ratingArr);
  }
}

let reorder = () => {
  orderedRight = false;
  orderPredictor(webcam);
}


let getUserRatings= () => {
  textToSpeech("Please rate this experience from 1 to 5")
  document.getElementById("rating-msg").style.display = "block";
  flag = 'fb';
}


let getUsername = () => {
  finalOrder = sentence;
  wordCount = 0;
  sentence = "";
  document.getElementById("order_fdbk_btn").style.display = "none"
  document.getElementById("spinner").style.display = "block"
  startocr();
}


let startocr = async (time = 3) => {
  flag = 'order';
  ratingArr = [];
  finalRating = 0;

  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  video.srcObject = stream;
  textToSpeech("Please show us your Id for your name.")
  await sleep(2500);
  countdown(time)
};

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function countdown(time) {
  for (let i = time; i > 0; i--) {
    document.getElementById("shutter-msg").style.display = "block";
    document.getElementById("shutter-msg").innerHTML = " Taking image in " + i;
    console.log(`Taking image in ${i} seconds...`);
    beep();
    await sleep(i * 1000);
  }
  console.log('Done');
  document.getElementById("shutter-msg").style.display = "none";
  ocr();
}



let ocr = () => {

  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  let image_data_url = webcam.canvas.toDataURL('image/jpeg');
  username = getName(image_data_url);

};
