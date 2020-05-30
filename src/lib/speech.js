import { IamAuthenticator } from 'ibm-watson/auth';
import SpeechToTextV1 from 'ibm-watson/speech-to-text/v1';


const speech = new SpeechToTextV1({
  //.env is hidden in storycollab
  authenticator: new IamAuthenticator({ apikey: process.env.REACT_APP_WATSON_API_KEY }),
  version: '5.0.0'
});

export default speech;
