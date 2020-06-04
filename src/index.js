import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from './lib/firebase.js';

//note: can't use fs (file system) bc react stubs out node core modules

//think about the relationship between people interacting. ppl care more when
//their actions have consequences on other ppl (or outcomes)
//anonymity -> lowered stakes -> disengagement
//look at post-structuralism (like flux, john cage, generated poetry, etc).


let dbRef = firebase.firestore().collection('words');

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
      disabled: false,
      recording: 'ready',
      startTime: 0,
      waitLeft: 0
    };
    //other way of writing is onSubmit={(event) => {this.handleChange(event)}}
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    //check if startTime exists from prev session
    if (localStorage.getItem('startTime')) {
      //check if 15 min has passed
      const timeLeft = 300000 - (new Date().getTime() - localStorage.getItem('startTime'))
      if (timeLeft > 0) { //if so, disable buttons and start time out w remaining time
        this.setState({disabled: true});
        setTimeout(() => {
          this.setState({disabled: false})
          localStorage.removeItem('startTime')
        }, timeLeft);
      }
    }
  }

  disableSubmit(){
    //disable buttons
    this.setState({disabled: true});
    //create startTime by getting current time and add to localStorage
    localStorage.setItem('startTime', new Date().getTime());
    //At the end of time out, remove startTime
    setTimeout(() => {
      this.setState({disabled: false})
      localStorage.removeItem('startTime')
    }, 300000);
  }

  handleChange(event) { //react re-renders after every change
    //prevents typing space
    this.setState({value: event.target.value.replace(' ', '')});
  }

  handleSubmit(event) {
    dbRef.add({
      text: this.state.value,
      timestamp: new Date().getTime() //Unix timestamp
    });
    event.preventDefault(); //prevents submit from navigating to a different page
    this.setState({value: ''}); //clears value
    this.disableSubmit();
  }

  handleDelete(id){
    //confirm alert
    if (window.confirm('Are you sure you want to delete this word?')){
      dbRef.doc(id).delete();
      this.disableSubmit();
    }
  }

  render() {
    return (
      <div>
        <div>
          <p>Enter a single word to add to the story or click on a word to remove it. <br/><br/>
          Choose carefully––only one action can be performed every 5 minutes.</p>
        </div>
        <div>
          <UpdatedStory onClick={id => this.handleDelete(id)} disabled={this.state.disabled}/>
        </div>
        <div>
          {this.state.disabled !== true &&(
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
