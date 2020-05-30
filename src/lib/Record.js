//Code from Rishabh :)
import React, { useRef, useEffect, useCallback, useState } from "react";
import firebase from './firebase.js';
import speech from './speech.js'

export default function Record(props) {

  const storageRef = firebase.storage().ref();

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const blobRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioRecordingDetails, setAudioRecordingDetails] = useState(null);
  const [error, setError] = useState(null);

  function createAudio() {
    //First, request user media (code from getMedia())
    //then, create blob for audio
    //then, return it as audioStream
    //pipe audiostream to service via websocket connection
    //service return data, pipe to console

    const blob = new Blob(chunksRef.current, {
      type: "audio/ogg; codecs=opus",
    });
    blobRef.current = blob;

    chunksRef.current = [];
    const audioStream = window.Blob.stream(blob);
    return audioStream;
    // const audioURL = window.URL.createObjectURL(blob);
    // setAudioUrl(audioURL);
    // console.log(audioURL);
    props.endCallback();
  }

  function handleRecord() {
    //this.setState({recording: true});
    var params = {
      objectMode: true,
      contentType: 'audio/ogg',
      //model: 'en-US_BroadbandModel',
      //timestamps: true,
    };
    const recognizeStream = speech.recognizeUsingWebSocket(params);

    //lineIn.pipe(recognizeStream).pipe(process.stdout);

    // fs.createReadStream('audio-file.flac').pipe(recognizeStream);

    //audioStream.pipe(recognizeStream);

    // recognizeStream.on('data', function(event) { onEvent('Data:', event); });
    // recognizeStream.on('error', function(event) { onEvent('Error:', event); });
    // recognizeStream.on('close', function(event) { onEvent('Close:', event); });
    //
    // function onEvent(name, event) {
    //   console.log(name, JSON.stringify(event, null, 2));
    // };

  }

  function getUserMedia() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported.");
      navigator.mediaDevices
        .getUserMedia(
          // constraints - only audio needed for this app
          {
            audio: true,
          }
        )

        // Success callback
        .then(function (stream) {
          console.log(stream);
          mediaRecorderRef.current = new MediaRecorder(stream);

          mediaRecorderRef.current.ondataavailable = (e) => {
            chunksRef.current.push(e.data);
          };

          mediaRecorderRef.current.onstop = function (e) {
            console.log("recorder stopped triggered");

            // const clipName = prompt("Enter a name for your sound clip");

            createAudio();

            // uploadAudio();
          };
        })

        // Error callback
        .catch(function (err) {
          console.log("The following getUserMedia error occured: " + err);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }

  useEffect(() => {
    getUserMedia();
  }, []);

  return (
    <button className="recordButton" onClick = {() => {
      if (mediaRecorderRef.current != null) {
        if (mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          setRecording(false);
          console.log(mediaRecorderRef.current.state);
          console.log("recorder stopped");
        } else {
          props.startCallback();
          mediaRecorderRef.current.start();
          setRecording(true);
          console.log(mediaRecorderRef.current.state);
          console.log("recorder started");
        }
      }
    }}>{recording ? "Stop" : "Record"}</button>
  );
}
