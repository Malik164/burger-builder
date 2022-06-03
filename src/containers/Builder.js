import React, { Component } from "react";
import Burger from "../components/burger/Burger";
import Controls from "../components/burger/controls/Controls";
// import Button from "../components/Button";
import withErrorHandler from "../components/HOC/withErrorHanlder";
import withRouter from "../components/HOC/withRouter";
import BackDrop from "../components/modal/BackDrop";
import OrderModal from "../components/modal/OrderModal";
import axios from "../components/OrderAxios/OrderAxios"
import Spinner from "../components/Spinner/Spinner";


// price info will handle the price of each ingredients of burger
let priceInfo = [
  {
    label: "lettuce",
    cost: 0.4,
  },
  {
    label: "beef",
    cost: 2.3,
  },
  {
    label: "onion",
    cost: 0.1,
  },
  {
    label: "tomato",
    cost: 0.3,
  },
  {
    label: "cheese",
    cost: 0.7,
  },
];
class Builder extends Component {
  state = {
    ingredients: {},
    price: 4,
    purchasing: false,
    loading: false,
    status: null,
    error: null
  };
  addIngredientHandler = (ingredient, type) => {
    // check the target ingredient added or to be removed
    let toUpdateCount = this.state.ingredients[ingredient];
    // get the previous price
    let toUpdatePrice = this.state.price;
    toUpdatePrice = parseFloat(toUpdatePrice);

    let targetPriceObj = priceInfo.filter((elm) => elm.label === ingredient)[0];
    // if add button is clicked
    if (type === "plus") {
      toUpdateCount = toUpdateCount + 1;
      toUpdatePrice = toUpdatePrice + targetPriceObj.cost;
    }
    // if removed button is clicked
    if (type === "minus") {
      toUpdateCount = toUpdateCount - 1;
      toUpdatePrice = toUpdatePrice - targetPriceObj.cost;
    }
    // change the state in immutable way
    let toUpdateIngredient = { ...this.state.ingredients };
    toUpdateIngredient[ingredient] = toUpdateCount;
    this.setState({ ingredients: toUpdateIngredient, price: toUpdatePrice });
  };

  // after receivin data update the state
  componentDidMount() {
    // if there is no error then only update the state
    let ingredients = this.props.response.data
    this.setState({ ingredients })
  }
  // function that show model
  setPurchaseHandler = () => {
    this.setState({ purchasing: true });
  };
  cancelPurchaseHandler = () => {
    this.setState({ purchasing: false, error: null });
  };

  // continue purchase handler
  continuePurchaseHanlder = (event) => {
    event.stopPropagation()
    
    // now navigate to the checkout url
    // pass all necessary information through url parameters
    let ingredients=this.state.ingredients
    
    let price=this.state.price
    let paramsObject={
      ...ingredients,
      price
    }
    let urlParamsArr=[]
    for (const key in paramsObject) {
        urlParamsArr.push(`${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
      
    }
    let redirectURL=`/checkout?${urlParamsArr.join('&')}`
    // now navigate to checkout page
    this.props.navigate(redirectURL)


    // this.setState({ loading: true })
    // // make a post request to firebase database
    // let order = {
    //   ingredients: this.state.ingredients,
    //   price: this.state.price,
    //   customer: {
    //     name: 'Adnan Malik',
    //     email: 'malikkingoo68@gmail.com',
    //     address: 'Jhang, Punjab, Pakistan'
    //   }
    // }
    // //------------------ POST REQUEST TO FIREBASE-------------------------
    // axios.post('/orders.json', order).then(response => {
    //   //  reset the ingredient because order has been successfully placed
    //   let updatedIngredeints = { ...this.state.ingredients }
    //   for (const key in updatedIngredeints)
    //     updatedIngredeints[key] = 0
    //   this.setState({ loading: false, error:null, ingredients: updatedIngredeints, price: 4 })
    // }).catch(e => {
    //   this.setState({
    //     loading: false,
    //     error: e.message,
    //     status: 404
    //   })
    // })
  }
  render() {
      let modalElm = (<OrderModal
        ingredients={this.state.ingredients}
        continuePurchaseHanlder={this.continuePurchaseHanlder}
        cancelPurchaseHandler={this.cancelPurchaseHandler}
        price={this.state.price}
      />)

    if (this.state.loading) {
      modalElm = <div className="text-center">
        <Spinner />
      </div>
    }
    // if (this.state.status === 200) {
    //   modalElm = <div className="text-center my-3">
    //     <div className="text-success">
    //       <i className="fa fa-check-circle-o fa-5x" aria-hidden="true"></i>
    //       <h5>Your Order has been Placed!</h5>
    //     </div>
    //     <Button type="btn-secondary my-2">
    //       View Orders
    //     </Button>
    //   </div>
    // }
    // if (this.state.error) {
    //   modalElm = <div className="text-center my-3">
    //     <div className="text-danger">
    //       <i className="fa fa-exclamation-circle fa-5x" aria-hidden="true"></i>
    //       <h5>{this.state.error}</h5>
    //     </div>
    //   </div>
    // }
    return (
      <>
        <div className="content">
          <div className="row g-3 px-1">
            <Burger
              ingredients={this.state.ingredients}
              price={this.state.price}
              setPurchaseHandler={this.setPurchaseHandler}

            />
            <Controls
              ingredients={this.state.ingredients}
              addIngredientHandler={this.addIngredientHandler}
              priceInfo={priceInfo}
            />

          </div>
        </div>

        <BackDrop
          show={this.state.purchasing}
          modalClosed={this.cancelPurchaseHandler}
        >
          {modalElm}
        </BackDrop>
      </>
    );
  }
}

export default withRouter(withErrorHandler(Builder, axios, '/ingredients.json'))
