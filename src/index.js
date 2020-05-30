import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from './lib/firebase.js';

//note: can't use fs (file system) bc react stubs out node core modules

let dbRef = firebase.firestore().collection('words');
let storageRef = firebase.storage().ref();


function UpdateWords() { //API call to firebase
  const [words, setWords] = useState([]);
  //creating a subscription to firestore
  useEffect(() => {
    const unsubscribe = dbRef.orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
      const newWords = snapshot.docs.map((doc) => ({
        id: doc.id,
        //spread operator (...) to merge doc.id w data
        ...doc.data()
      }))
      setWords(newWords)
    })
    return () => unsubscribe()
  }, []); //2nd parameter must be empty array, otherwise will rerun ad infinitum

  return words;
}

function UpdatedStory(props) {
  const words = UpdateWords();

  return(
    <ul>
      {words.map((word) =>
        <li key={word.id}>
          <button onClick={() => props.onClick(word.id)} disabled={props.disabled}>
            {word.text}
          </button>
        </li>
      )}
    </ul>
  );
}

// React Component
class Master extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      submitEnabled: true,
      disabled: false,
      recording: 'ready'
    };

    this.handleChange = this.handleChange.bind(this); //other way of writing is onSubmit={(event) => {this.handleChange(event)}}
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  disableSubmit(){
    this.setState({submitEnabled: false, disabled: true});
    //after 15 min, re-enable submit
    setTimeout(() => this.setState({submitEnabled: true, disabled: false}), 1000);
  }

  handleChange(event) { //react re-renders after every change
    //prevents typing space
    this.setState({value: event.target.value.replace(' ', '')});
  }

  handleSubmit(event) {
    const unsubscribe = dbRef.add({
      text: this.state.value,
      timestamp: new Date().getTime() //Unix timestamp
    });
    event.preventDefault(); //prevents submit from navigating to a different page
    this.setState({value: ''}); //clears value
    this.disableSubmit();
    return () => unsubscribe();
  }

  handleDelete(id){
    const unsubscribe = dbRef.doc(id).delete();
    this.disableSubmit();
    return () => unsubscribe();
  }

  render() {

    // start recording
    const startCallback = () => {
      this.setState({recording: 'started'})
    };

    // end recording
    const endCallback = () => {
      this.setState({recording: 'finished'})
    };

    // uploading
    const uploadingCallback = () => {
      this.setState({recording: 'uploading'})
    };

    // saved
    const savedCallback = () => {
      this.setState({recording: 'saved'})
    };

    return (
      <div>
        <div>
          <p>Enter a single word to add to the story OR click on a word to remove it from the story. <br/><br/>
          You can only perform one action every 15 minutes.</p>
        </div>
        <div>
          <UpdatedStory onClick={id => this.handleDelete(id)} disabled={this.state.disabled}/>
        </div>
        <div>
          {this.state.submitEnabled === true &&(
            <form onSubmit={this.handleSubmit}>
              <label>
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              </label>
              <input type="submit" value="SUBMIT" disabled={!this.state.value}/>
            </form>
          )}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Master />,
  document.getElementById('root')
);
