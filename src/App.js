import React, { Component } from 'react';
import './App.css';



// Credit Card Input/Type Recognition
class CreditCard extends Component {
  constructor(props) {
    super(props);
    this.state = { number: '' };
  }
  process(number) {
    return { text: '', type: '' };
  }
  render () {
    let { text: text, type: type } = this.process(this.state.number);
    return (
      <div>
        <input type="text" value={text} />
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



// on click state change
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




