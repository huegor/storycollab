//Code from Rishabh :)
import React, { useRef, useEffect, useCallback, useState } from "react";
import firebase from './firebase.js';

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
    const blob = new Blob(chunksRef.current, {
      type: "audio/ogg; codecs=opus",
    });
    blobRef.current = blob;

    chunksRef.current = [];
    const audioURL = window.URL.createObjectURL(blob);
    setAudioUrl(audioURL);
    console.log(audioURL);
    props.endCallback();
  }

  function uploadAudio() {
    props.uploadingCallback();
    const fileName =
      audioUrl.split("/").pop() + audioUrl.length;
    const filePath = `audio/${fileName}`;

    const audioRef = storageRef.child(filePath);
    audioRef
      .put(blobRef.current)
      .then((snapshot) => {
        console.log("Uploaded", snapshot);
        return snapshot.ref.getDownloadURL();
        //   setAudioRemoteUrl(snapshot.ref.getDownloadURL());
      })
      .then((url) => {
        console.log(url);
        setAudioRecordingDetails({ url: url });
        return firebase.firestore().collection("answers").add({
          word_id:url,
          path: filePath
        });
      })
      .then(() => {
        props.savedCallback();
      })
      .catch((error) => {
        props.savedCallback();
        console.log(error);
        setError("There was an error ", error);
      });
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
    <button>{recording ? "Stop" : "Record"}</button>
  );
}
