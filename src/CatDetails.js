import React, { Component } from 'react';
import axios from 'axios';
import * as ReactBootstrap from 'react-bootstrap';
import _ from 'lodash';

class CatDetails extends Component {
 
  constructor(prop){
    super(prop);

    this.state = {
      cat: [],
      catDetails:[]
      
    }
  }
  //this.props.match.params.id using this as parameters on the API
  componentDidMount(){

    const id = this.props.match.params.id;

    axios.get('https://api.thecatapi.com/v1/images/'+id)
    .then(response => {

      console.log(response.data);
      this.setState({
        cat : response.data,
        catDetails: response.data.breeds[0]
      });
    });


  }

  render() {

    
    let display = <ReactBootstrap.Container>Loading..</ReactBootstrap.Container>;
    if(!_.isEmpty(this.state.cat)){
      let back = "/?breed=" + this.state.catDetails.id;
      display = <ReactBootstrap.Container>
                  <ReactBootstrap.Card>
                    <ReactBootstrap.Card.Header>
                      <ReactBootstrap.Button href={back}>Back</ReactBootstrap.Button>
                    </ReactBootstrap.Card.Header>
                    <ReactBootstrap.CardImg  src={this.state.cat.url} alt={this.state.catDetails.name}></ReactBootstrap.CardImg>
                    <ReactBootstrap.Card.Body>
                      <h4>{this.state.catDetails.name}</h4>
                      <h5>Origin: {this.state.catDetails.origin}</h5>
                      <h6>{this.state.catDetails.temperament} </h6>
                      <p> {this.state.catDetails.description}</p>
                    </ReactBootstrap.Card.Body>
                  </ReactBootstrap.Card>
                </ReactBootstrap.Container>;
    }
    return (<div className="Cat">
              {display}
            </div>);

  }
}

export default CatDetails;