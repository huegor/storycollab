(this.webpackJsonpstorycollab=this.webpackJsonpstorycollab||[]).push([[0],{16:function(e,t,a){e.exports=a(34)},21:function(e,t,a){},34:function(e,t,a){"use strict";a.r(t);var n=a(9),l=a(10),i=a(3),r=a(14),o=a(13),s=a(15),c=a(12),u=a(0),d=a.n(u),m=a(11),b=a.n(m),h=(a(21),a(6)),f=a.n(h);a(25),a(33),a(29);f.a.initializeApp({apiKey:"AIzaSyC-d19gOOzqHpTYOEk5Lld3pRsTMfo8Wzg",authDomain:"storycollab-def01.firebaseapp.com",databaseURL:"https://storycollab-def01.firebaseio.com",projectId:"storycollab-def01",storageBucket:"storycollab-def01.appspot.com",messagingSenderId:"246768205772",appId:"1:246768205772:web:aa742d8c191d5f9ba96769"});var v=f.a.firestore().collection("words");function p(e){var t=function(){var e=Object(u.useState)([]),t=Object(c.a)(e,2),a=t[0],n=t[1];return Object(u.useEffect)((function(){var e=v.orderBy("timestamp","asc").onSnapshot((function(e){var t=e.docs.map((function(e){return Object(s.a)({id:e.id},e.data())}));n(t)}));return function(){return e()}}),[]),a}();return d.a.createElement("ul",null,t.map((function(t){return d.a.createElement("li",{key:t.id},d.a.createElement("button",{onClick:function(){return e.onClick(t.id)},disabled:e.disabled},t.text))})))}var y=function(e){Object(r.a)(a,e);var t=Object(o.a)(a);function a(e){var l;return Object(n.a)(this,a),(l=t.call(this,e)).state={value:"",disabled:!1,recording:"ready",startTime:0,waitLeft:0},l.handleChange=l.handleChange.bind(Object(i.a)(l)),l.handleSubmit=l.handleSubmit.bind(Object(i.a)(l)),l}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this;if(localStorage.getItem("startTime")){var t=3e5-((new Date).getTime()-localStorage.getItem("startTime"));t>0&&(this.setState({disabled:!0}),setTimeout((function(){e.setState({disabled:!1}),localStorage.removeItem("startTime")}),t))}}},{key:"disableSubmit",value:function(){var e=this;this.setState({disabled:!0}),localStorage.setItem("startTime",(new Date).getTime()),setTimeout((function(){e.setState({disabled:!1}),localStorage.removeItem("startTime")}),3e5)}},{key:"handleChange",value:function(e){this.setState({value:e.target.value.replace(" ","")})}},{key:"handleSubmit",value:function(e){v.add({text:this.state.value,timestamp:(new Date).getTime()}),e.preventDefault(),this.setState({value:""}),this.disableSubmit()}},{key:"handleDelete",value:function(e){window.confirm("Are you sure you want to delete this word?")&&(v.doc(e).delete(),this.disableSubmit())}},{key:"render",value:function(){var e=this;return d.a.createElement("div",null,d.a.createElement("div",null,d.a.createElement("p",null,"Enter a single word to add to the story or click on a word to remove it. ",d.a.createElement("br",null),d.a.createElement("br",null),"Choose carefully\u2013\u2013only one action can be performed every 5 minutes.")),d.a.createElement("div",null,d.a.createElement(p,{onClick:function(t){return e.handleDelete(t)},disabled:this.state.disabled})),d.a.createElement("div",null,!0!==this.state.disabled&&d.a.createElement("form",{onSubmit:this.handleSubmit},d.a.createElement("label",null,d.a.createElement("input",{type:"text",value:this.state.value,onChange:this.handleChange})),d.a.createElement("input",{type:"submit",value:"SUBMIT",disabled:!this.state.value}))))}}]),a}(d.a.Component);b.a.render(d.a.createElement(y,null),document.getElementById("root"))}},[[16,1,2]]]);
//# sourceMappingURL=main.46dfff9d.chunk.js.map