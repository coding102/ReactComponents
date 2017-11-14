import React, { Component } from 'react';
import './App.css';



// Tweet Box & Counter
class TweetBoxStatus extends React.Component {
  render() {
    return (
      <textarea onChange={this.props.setStatusText} placeholder="Tweet Something" />
    );
  }
}
class TweetBoxCounter extends React.Component {
  constructor(props) {
    super(props);
    this.counterStyles = this.counterStyles.bind(this);
    this.remainingCharacters = this.remainingCharacters.bind(this);
  }
  counterStyles() {
    let color = 'red';
    let remainingCharacters = this.remainingCharacters();
    if (remainingCharacters > 30) {
      color = 'green';
    } else if (remainingCharacters > 0) {
      color = 'orange';
    }
    return { color: color };
  }
  remainingCharacters() {
    return 140 - this.props.statusText.length;
  }
  render() {
    return (
      <span style={this.counterStyles()}>{this.remainingCharacters()}</span>
    )
  }
}
class TweetBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { statusText: '' };
    this.setStatusText = this.setStatusText.bind(this);
    this.submitTweet = this.submitTweet.bind(this);
    this.statusTextValid = this.statusTextValid.bind(this);
  }
  setStatusText(event) {
    let text = event.target.value;
    this.setState({ statusText: text });
  }
  submitTweet() {
    if (this.statusTextValid()) {
      this.props.tweetSubmitted(this.state.statusText);
    }
  }
  statusTextValid() {
    return this.state.statusText.length > 0 && this.state.statusText <= 140;
  }
  render() {
    return (
      <div>
        <TweetBoxStatus setStatusText={this.setStatusText} />
        <TweetBoxCounter statusText={this.state.statusText} />
        <button type="submit" onClick={this.submitTweet} >Tweet</button>
      </div>
    );
  }
}




// Country's phone # prefix recognition
let prefixes = {
  'United States': '+1',
  'Germany': '+49',
  'Guatemala': '+502',
  'Japan': '+81'
}
class Prefixer extends React.Component {
  constructor(props) {
    super(props);
    let country = this.props.initialCountry || "United States";
    this.state = { country: country };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    let newCountry = e.target.value;
    this.setState({ country: newCountry });
  }
  countryItem(country, index) {
    return (
      <option value={country} key={index}>{country}</option>
    );
  }
  render() {
    let prefix = prefixes[this.state.country];
    return (
      <div className="form-horizontal">
        <div className="form-group">
          <label htmlFor="selectbox" className="col-sm-3 control-label">Country</label>
          <div className="col-sm-3">
            <select className="form-control" id="selectbox" onChange={this.handleChange} value={this.state.country} >
              {Object.keys(prefixes).map(this.countryItem)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="input-text" className="col-sm-3 control-label">Phone Number</label>
          <div className="col-sm-3">
            <div className="input-group">
              <span className="input-group-addon">{prefix}</span>
              <input type="text" className="form-control" id="input-text" />

            </div>
          </div>
        </div>
      </div>
    )
  }
}



// Credit Card Input/Card Type Recognition
let types = {
  'Visa': /^4/,
  'MasterCard': /^5[1-5]/,
  'American Express': /^3[47]/
};
class CreditCard extends Component {
  constructor(props) {
    super(props);
    this.state = { number: '' };
    this.handleChange = this.handleChange.bind(this);
    this.checkType = this.checkType.bind(this);
  }
  process(number) {
    let type = this.checkType(number);
    let text = this.insertSpaces(number);
    text = text.trim();
    return { text: text, type: type };
  }
  handleChange(e) {
    let newValue = e.target.value;
    let newNumber = this.filterWhitespace(newValue);
    this.setState({ number: newNumber });
  }
  filterWhitespace(text) {
    return text.replace(/\s/g, '');
  }
  insertSpaces(text) {
    return text.replace(/(.{4})/g, '$1 ');
  }
  checkType(text) {
    let types = this.props.types;
    for (var type in types) {
      if (text.match(types[type])) {
        return type;
      }
    }
    return '';
  }
  render () {
    let { text: text, type: type } = this.process(this.state.number);
    return (
      <div>
        <input type="text" value={text} onChange={this.handleChange} />
        <input type="text" value={type} readOnly />
      </div>
    )
  }
}




// On Click State Change
class Clicked extends Component {
  constructor(props) {
    super(props);
    this.state = {clicked: false};
    this.linkClicked = this.linkClicked.bind(this);
  }
  linkClicked(event) {
    this.setState({clicked: true});
  }
  render() {
    if (this.state.clicked === false) {
      return (
        <div>
          <h1>Hi {this.props.name}</h1>
          <a href='https://www.youtube.com/watch?v=XxVg_s8xAms&t=1s' id="click" onClick={this.linkClicked}>Click to See State Change</a>
        </div>
      );
    } else {
      return (
        <div id="two-tags">
          <h1>Hi {this.props.name}</h1>
          <span>It's a link to watch an introduction to React</span>
        </div>
      );
    }
  }
}


// Top Component   
class App extends Component {
  render() {
    return (
      <div className="App">
        <Clicked name="Visitor" />
        <CreditCard types={types} />
        <Prefixer />
        <TweetBox />
      </div>
    );
  }
}
export default App;




