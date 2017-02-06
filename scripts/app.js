/**
function QwotrApp() {
  return (
    <div>
      HI THERE
    </div>
  );
}*/
// Initialize Firebase
var config = {
  apiKey: "AIzaSyCMqUJiIQk3ySiXS1bQFpb-7kRwXUshUnQ",
  authDomain: "qwotr-f057a.firebaseapp.com",
  databaseURL: "https://qwotr-f057a.firebaseio.com",
  storageBucket: "qwotr-f057a.appspot.com",
  messagingSenderId: "333883673869"
};
firebase.initializeApp(config);


var Quote = React.createClass({
  render: function() {
    return (
      <div className="quote">
        <h2 className='quoteAuthor'>{this.props.author}</h2>
        <h3 className="quoteText">{this.props.quoteText}</h3>
      </div>
    );
  }
})

var QuoteList = React.createClass({
  render: function() {
    console.log("props:")
    console.log(this.props);
    var quoteNodes = this.props.data.map(function(quote, index) {
      return <Quote key={index} author={quote.author} quoteText={quote.quote}/>;
    });
    return <div className="quoteList">{quoteNodes}</div>
  }
})

var QuoteFeed = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    //var firebaseRef = firebase.database().ref('todoApp/items');
    //this.bindAsArray(firebaseRef.limitToLast(25), 'items');
    this.state = {what: "what"}
    var quotesRef = firebase.database().ref('quotes');
    this.bindAsArray(quotesRef, "myquotes");
  },
  /*
  <CommentList data={this.state.myquotes} />
  //{this.state.myquotes}
  */
  render: function() {
    return (
       <div id="quotesContainer">
       <QuoteList data={this.state.myquotes}/>
       </div>
     );
  }
});

var SubmitQuote = React.createClass({
  mixins: [ReactFireMixin],

  componentWillMount: function() {
    this.state = {
      author: "who said it?",
      quote: "what was said?"
    }
  },

  handleAuthorChange: function(event) {
    this.setState({author: event.target.value});
  },
  handleQuoteChange: function(event) {
    this.setState({quote: event.target.value});
  },

  handleSubmit: function(event){
    event.preventDefault();
    var auth = firebase.auth();
    var currentUser = auth.currentUser;
    console.log("auth:")
    console.log(currentUser);
    var quotesRef = firebase.database().ref('quotes');
    console.log(this.state);
    quotesRef.push({
      author: this.state.author,
      name: currentUser.displayName,
      quote: this.state.quote
    }).then(function() {
      console.log("success?");
    }.bind(this)).catch(function(Error) {
      console.error("error: ", error);
    })
  },

  render:function() {
    return(
      <form onSubmit={this.handleSubmit}>
        <label>
        Quote text
        <input
          name="quoteText"
          type="text"
          onChange={this.handleQuoteChange} />
        </label>
        <label>
        Quote author
        <input
          name="quoteAuthor"
          type="text"
          onChange={this.handleAuthorChange} />
        </label>
        <input type="submit" value="Submit" />

      </form>
    );
  }
});


var SignIn = React.createClass({
  handleSignIn: function(event) {
    console.log('sign in!');
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  },
  render: function() {
    return <button id="sign-in" onClick={this.handleSignIn}>Sign in with google</button>;
  }
});

//class QwotrApp extends React.Component {
var QwotrApp = React.createClass({
  mixins: [ReactFireMixin],
  render: function() {
    return (
      <div>
      <SignIn />
      <QuoteFeed />
      <SubmitQuote />
      </div>
    );
  }
});



ReactDOM.render(<QwotrApp />, document.getElementById('qwotrApp'));
