import React, { Component } from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';



class CatList extends Component {
  
  constructor(prop){
   
    super(prop);
    this.state = {
      cats: [],
      page: 1,
      breeds: [], 
      selected_breed: 0,
      loadmore: true,
      disabledBtn: true,
      catLength: 0
    };

  }
  
  //getting the catlist by category
  getCatlist(){

    axios.get('https://api.thecatapi.com/v1/images/search?page='+this.state.page+'&limit=10&breed_id='+this.state.selected_breed)
    .then(response => {

      this.setState({ cats: response.data, disabledBtn : false, catLength: response.data.length});

      if(_.isEmpty(this.state.cats)){
        this.setState({disabledBtn:true, selected_breed:'0'});
      }
    })
    .catch(function (error) {
      console.log(error);
    });
     
  }

  //if there is an this.props.location.search value
  //then I will get the cat list on that selected breed
  componentDidMount(){
    
    if(this.props.location.search !== ''){

      const values = this.props.location.search;
      const breedValue = values.split("=");
      //console.log(breedValue[1]);
      this.setState({
        selected_breed: (breedValue.length > 1 ? breedValue[1] : 0)
      }, () => {

        this.getCatlist();
      });

    }

    axios.get('https://api.thecatapi.com/v1/breeds')
    .then(response => {
      this.setState(
        { breeds: response.data
        });
    })
    .catch(function (error) {
      console.log(error);
    });
    
    
  }

  //handle the onchange function or the selection of cat breed
  handleChange = (event) => {

    const selectedValue = event.target.value;

    this.setState({
      page: 1,
      selected_breed: selectedValue,
      disabledBtn: true, 
      loadmore: true
    },() => {
      this.getCatlist();
    });

  };

  //handle the load more click event
  //increment page number for API request
  //merge the old cat data with the new cat data
  //used the _.uniqBy function from the loadash inorder to filter out redundunt data. I made this approach since the API always return a cat data even if im in page 100 
  //hide loadmore button after if the old cat array length and new cat array length are eqaul
  handleClick = (event) =>{
   
    axios.get('https://api.thecatapi.com/v1/images/search?page='+(this.state.page + 1)+'&limit=10&breed_id='+this.state.selected_breed)
    .then(response => {
      
      let OldCat = this.state.cats;
      let OldAndNewCat = response.data.concat(OldCat);

      let filteredCat = _.uniqBy(OldAndNewCat, function (e) {
        return e.id;
      });
      
      if(filteredCat.length !== this.state.catLength){

        this.setState({ cats: filteredCat, page: this.state.page + 1, catLength : filteredCat.length});
      }else{
        
        this.setState({ cats: response.data, loadmore : false, disabledBtn: false});
      }
      
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //redering
  //Showing the list if data is not null after the fetching
  render() {

    let list = <ReactBootstrap.Col>No cats available</ReactBootstrap.Col>;
    if(!_.isEmpty(this.state.cats)){

      list = this.state.cats.map((cat, index)=>
        <ReactBootstrap.Col md={3} sm={6} key={index}>
          <ReactBootstrap.Card>
            <ReactBootstrap.CardImg src={cat.url} alt={cat.breeds.name}/>
            <ReactBootstrap.Card.Body><ReactBootstrap.Button variant="primary" href={cat.id} block>View details</ReactBootstrap.Button></ReactBootstrap.Card.Body>
          </ReactBootstrap.Card>
        </ReactBootstrap.Col>
      );
    }

    return (
      <div className="home">
        <ReactBootstrap.Container>
          <h1>Cat Browser</h1>
          <ReactBootstrap.Row>
            <ReactBootstrap.Col md={3} sm={6}>
              <ReactBootstrap.Form.Group >
                <ReactBootstrap.Form.Label>Breed</ReactBootstrap.Form.Label>
                <ReactBootstrap.Form.Control as="select" onChange={this.handleChange} value={this.state.selected_breed} disabled={this.state.disabled}>
                  <option key={'00'} value={0}>Select Breed</option>
                  {this.state.breeds.map((breed) => <option key={breed.id} value={breed.id}>{breed.name}</option>)}
                </ReactBootstrap.Form.Control >
              </ReactBootstrap.Form.Group >
            </ReactBootstrap.Col>
          </ReactBootstrap.Row>
          
          <ReactBootstrap.Row>
            {list}
          </ReactBootstrap.Row>
          {this.state.loadmore ? <ReactBootstrap.Row>
            <ReactBootstrap.Button variant="success"  onClick={this.handleClick} disabled={this.state.disabledBtn} >Load More</ReactBootstrap.Button>
          </ReactBootstrap.Row> : ''}
        </ReactBootstrap.Container>

      </div>
    );
  
  }
}

export default CatList;