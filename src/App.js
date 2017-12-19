import React, { Component } from 'react';
import { Table, ListGroup, ListGroupItem, Grid, Row, Col, Panel, FormControl, FormGroup, Well, ProgressBar, ControlLabel } from 'react-bootstrap';
import './App.css';
var clone = require('clone');
var classNames = require('classnames');



// dynamic invoice
class InvoiceLineItems extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
        line_items: [
        { price: null, amount: null },
      ]
    };
    this.priceChanged = this.priceChanged.bind(this);
    this.amountChanged = this.amountChanged.bind(this);
    this.addLineItem = this.addLineItem.bind(this);
  }
  priceChanged(index, event) {
    let { line_items } = this.state;
    line_items[index].price = event.target.value;
    this.setState({ line_items });
  }
  amountChanged(index, event) {
    let { line_items } = this.state;
    line_items[index].amount = event.target.value;
    this.setState({ line_items });
  }
  totalPrice(price, amount) {
    let p = parseFloat(price);
    let a = parseFloat(amount);
    return ((isNaN(p) || isNaN(a)) ? 0 : p * a);
  }
  calculateTotal() {
    let { line_items } = this.state;
    return line_items.map(i => this.totalPrice(i.price, i.amount))
          .reduce((pv, cv) => pv + cv, 0);
  }
  addLineItem(event) {
    let { line_items } = this.state;
    line_items.push({ price: null, amount: null });
    this.setState({ line_items });
  }
  tableHeader() {
    return (
      <thead>
        <tr>
          <th width="1%">Nr</th>
          <th width="55%"></th>
          <th width="20%"></th>
          <th width="10%"></th>
          <th width="10%"></th>
          <th width="4%"></th>
        </tr>
      </thead>
    );
  }
  tableFooter() {
    return(
      <tfoot>
        <tr>
          <td colSpan="4"></td>
          <th><h4>{this.calculateTotal()}</h4></th>
          <td>
            <button className="btn btn-success" 
                              onClick={this.addLineItem}>
              <span className="glyphicon glyphicon-plus"></span>
            </button>
          </td>
        </tr>
      </tfoot>
    );
  }
  render() {
    let line_items=[];
    for(var index in this.state.line_items) {
      line_items.push(
        <LineItem index={index}
                  price={this.state.line_items[index].price}
                  amount={this.state.line_items[index].amount}
                  priceChanged={this.priceChanged}
                  amountChanged={this.amountChanged} />
      );
    }
    return(
      <table className="table table-bordered table-hover">
        {this.tableHeader()}
        <tbody>
          {line_items}
        </tbody>
        {this.tableFooter()}
      </table>
    );
  }
}
class LineItem extends React.Component {
  calculateTotal() {
    let { price, amount } = this.props;
    let p = parseFloat(price);
    let a = parseFloat(amount);
    return ((isNaN(p) || isNaN(a)) ? 0 : p * a);
  }
  number() {
    return (parseInt(this.props.index) + 1);
  }
  render() {
    let { index, price, priceChanged, amount, amountChanged } = this.props;
    return (
      <tr>
        <td>{this.number()}</td>
        <td>
          <input name="title" className="form-control" />
        </td>
        <td>  
          <div className="input-group">
            <div className="input-group-addon">$</div>
            <input name="price" value={price} 
                                className="form-control"
                                onChange={priceChanged.bind(null, index)} />
          </div>
        </td>
        <td>
          <input name="amount" value={amount}
                               className="form-control"
                               onChange={amountChanged.bind(null, index)} />
        </td>
        <td><h4>${this.calculateTotal()}</h4></td>
        <td>  
          <button className="btn btn-danger">
            <span className="glyphicon glyphicon-trash"></span>
          </button>
        </td>
      </tr>
    );
  }
}




// Password Strength
class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: "" };

    this.changePassword = this.changePassword.bind(this);
  }

  changePassword(password) {
    this.setState({ password });
  }

  render() {
    let { goodPasswordPrinciples } = this.props;
    let { password } = this.state;

    return (
      <Grid>
        <Row>
          <Col md={8}>
            <PasswordField
              password={password}
              onPasswordChange={this.changePassword}
              principles={goodPasswordPrinciples}
            />
          </Col>
          <Col md={4}>
            <StrengthMeter
              password={password}
              principles={goodPasswordPrinciples}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

const SPECIAL_CHARS_REGEX = /[^A-Za-z0-9]/;
const DIGIT_REGEX = /[0-9]/;

PasswordInput.defaultProps = {
  goodPasswordPrinciples: [
    {
      label: "6+ characters",
      predicate: password => password.length >= 6
    },
    {
      label: "with at least one digit",
      predicate: password => password.match(DIGIT_REGEX) !== null
    },
    {
      label: "with at least one special character",
      predicate: password => password.match(SPECIAL_CHARS_REGEX) !== null
    }
  ]
};

class StrengthMeter extends React.Component {
  render() {
    return (
      <Panel>
        <PrinciplesProgress {...this.props} />
        <h5>A good password is:</h5>
        <PrinciplesList {...this.props} />
      </Panel>
    );
  }
}

class PrinciplesProgress extends React.Component {
  satisfiedPercent() {
    let { principles, password } = this.props;

    let satisfiedCount = principles
      .map(p => p.predicate(password))
      .reduce((count, satisfied) => count + (satisfied ? 1 : 0), 0);

    let principlesCount = principles.length;

    return satisfiedCount / principlesCount * 100.0;
  }

  progressColor() {
    let percentage = this.satisfiedPercent();

    return classNames({
      danger: percentage < 33.4,
      success: percentage >= 66.7,
      warning: percentage >= 33.4 && percentage < 66.7
    });
  }

  render() {
    return (
      <ProgressBar
        now={this.satisfiedPercent()}
        bsStyle={this.progressColor()}
      />
    );
  }
}

class PrinciplesList extends React.Component {
  principleSatisfied(principle) {
    let { password } = this.props;

    return principle.predicate(password);
  }

  principleClass(principle) {
    let satisfied = this.principleSatisfied(principle);

    return classNames({
      ["text-success"]: satisfied,
      ["text-danger"]: !satisfied
    });
  }

  render() {
    let { principles } = this.props;

    return (
      <ul>
        {principles.map(principle =>
          <li key={principle.label} className={this.principleClass(principle)}>
            <small>
              {principle.label}
            </small>
          </li>
        )}
      </ul>
    );
  }
}

class PasswordField extends React.Component {
  constructor(props) {
    super(props);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handlePasswordChange(ev) {
    let { onPasswordChange } = this.props;
    onPasswordChange(ev.target.value);
  }

  satisfiedPercent() {
    let { principles, password } = this.props;

    let satisfiedCount = principles
      .map(p => p.predicate(password))
      .reduce((count, satisfied) => count + (satisfied ? 1 : 0), 0);

    let principlesCount = principles.length;

    return satisfiedCount / principlesCount * 100.0;
  }

  inputColor() {
    let percentage = this.satisfiedPercent();

    return classNames({
      error: percentage < 33.4,
      success: percentage >= 66.7,
      warning: percentage >= 33.4 && percentage < 66.7
    });
  }

  render() {
    let { password } = this.props;

    return (
      <FormGroup validationState={this.inputColor()}>
        <ControlLabel>Password</ControlLabel>
        <FormControl
          type="password"
          value={password}
          onChange={this.handlePasswordChange}
        />
        <FormControl.Feedback />
      </FormGroup>
    );
  }
}






// Search function
class ChannelSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = { searchQuery: '' };
    this.changeSearchQuery = this.changeSearchQuery.bind(this);
    this.filteredChannels  = this.filteredChannels.bind(this);
  }

  changeSearchQuery(newSearchQuery) {
    this.setState({ searchQuery: newSearchQuery });
  }

  filteredChannels() {
    let { channels }    = this.props,
        { searchQuery } = this.state;

    return channels.filter(channel => {
      return channel.indexOf(searchQuery) === 0;
    });
  }

  render() {  
    let { searchQuery } = this.state,
        channels = this.filteredChannels();

    return (
      <Grid fluid={true}>
        <Row>
          <ChannelSearchInput searchQuery={searchQuery} 
                              onSearchQueryChanged={this.changeSearchQuery} />
          {channels.length === 0 ? 
            <NoValidChannels searchQuery={searchQuery} /> :
            <Channels channels={channels} />
          }
        </Row>
      </Grid>
    );
  }  
}

class ChannelSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
  } 

  handleSearchQueryChange(ev) {
    let { onSearchQueryChanged } = this.props;
    onSearchQueryChanged(ev.target.value)
  }

  render() {    
    let { searchQuery } = this.props;

    return (
      <FormControl type="text" 
         placeholder="Search channels…" 
         bsSize="large"
         value={searchQuery}
         onChange={this.handleSearchQueryChange} />
    );
  }
}

class Channels extends React.Component {
  render() {
    let { channels } = this.props;

    return (
      <ListGroup>
        {channels.map(channel =>
          <ListGroupItem key={channel} href={`#${channel}`}>
            #{channel}
          </ListGroupItem>
        )}
      </ListGroup>
    );    
  }
}

class NoValidChannels extends React.Component {
  render() {
    let { searchQuery } = this.props;

    return (<Well>There are no channels matching 
                  your query <strong>"{searchQuery}"</strong>.
            </Well>);
  }
}
ChannelSearch.defaultProps = {
  channels: [
    "react native",
    "api",
    "javascript",
    "ruby",
    "rails",
    "graphql",
    "redux",
    "dom",
    "loop"
  ]
};




// Sortable table
class SortableHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { order: null };
    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.setOrder = this.setOrder.bind(this);
  }
  setOrder() {
    let { order } = this.state;
    if (order == null || order === "v") {
      this.setState({ order: "^" });
    }
    else {
      this.setState({ order: "v" });
    }
  }
  handleHeaderClick(event) {
    event.preventDefault();
    this.setOrder();
    this.props.onClick(this.props.attribute, this.state.order);
  }
  render() {
    let indicator;
    if (this.state.order) {
      indicator = " " + this.state.order;
    }
    return (
      <th>
        <a onClick={this.handleHeaderClick}>{this.props.title}</a>
        {indicator}
      </th>
    );
  }
}
class SortableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { records: this.props.initialRecords };
    this.sort = this.sort.bind(this);
  }
  wrap(array) {
    return array.map(function(item, index) {
      return { key: item, position: index };
    });
  }
  unwrap(array) {
    return array.map(function(item, index){
      return item.key;
    });
  }
  getComparator(attribute, order) {
    if (order === "^") {
      return function(a, b) {
        let diff = b.key[attribute].localeCompare(a.key[attribute]);
        if (diff === 0) {
          return a.position - b.position;
        }
        return diff;
      };
    }
    else {
      return function(a, b) {
        let diff = a.key[attribute].localeCompare(b.key[attribute]);
        if (diff === 0) {
          return a.position - b.position;
        }
        return diff;
      };
    }
  }
  sort(attribute, order) {
    let { records } = clone(this.state);
    let comparator = this.getComparator(attribute, order);
    records = this.wrap(records);
    records.sort(comparator);
    records = this.unwrap(records);
    this.setState({ records: records });
  }
  render() {
    let { records } = this.state;
    return (
      <Table striped bordered condensed hover>
        <thead>
          <tr>
            <th>#</th>
            <SortableHeader title="First Name" 
                            attribute="firstName" 
                            onClick={this.sort} />
            <SortableHeader title="Last Name" 
                            attribute="lastName" 
                            onClick={this.sort} />
            <SortableHeader title="Birth Date" 
                            attribute="birthDate" 
                            onClick={this.sort} />
          </tr>
        </thead>
        <tbody>
          {records.map(this.renderRow)}
        </tbody>
      </Table>
    );
  }
  renderRow(record, index) {
    return (
      <tr key={index}>
        <th>{index + 1}</th>
        <th>{record.firstName}</th>
        <th>{record.lastName}</th>
        <th>{record.birthDate}</th>
      </tr>
    );
  }
}
SortableTable.defaultProps = {
  initialRecords: [
    {firstName: "Angus", lastName: "Young", birthDate: "1960-03-31"},
    {firstName: "Mark", lastName: "Young", birthDate: "1965-03-31"},
    {firstName: "Erick", lastName: "Young", birthDate: "1970-03-31"},
    {firstName: "Janis", lastName: "Scott", birthDate: "1980-03-31"},
    {firstName: "Leslie", lastName: "William", birthDate: "1981-03-31"},
    {firstName: "Zul", lastName: "Sams", birthDate: "1966-03-31"}
  ]
};



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
       
        <SortableTable />
       
        <ChannelSearch />

        <PasswordInput />

        <InvoiceLineItems />

      </div>
    );
  }
}
export default App;




