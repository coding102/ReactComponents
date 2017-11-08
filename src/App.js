import React, { Component } from 'react';
import './App.css';



// Credit Card Input/Card Type Recognition
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
let types = {
  'Visa': /^4/,
  'MasterCard': /^5[1-5]/,
  'American Express': /^3[47]/
};



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



class App extends Component {
  render() {
    return (
      <div className="App">
        <Clicked name="Visitor" />
        <CreditCard types={types} />
      </div>
    );
  }
}
export default App;




