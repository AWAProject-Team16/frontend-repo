import { BrowserRouter } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import RouterURL from "./router/RouterURL";
import Data from "./data.json";
import jwt from "jsonwebtoken";
import styles from "./App.module.css";
import React, { Component } from "react";
import { CartContext, NewOrdersContext } from "./context/Contexts";
// import Data from './data.json';
import axios from "axios";

const API_ADDRESS = process.env.REACT_APP_API_ADDRESS;
const jwtFromStorage = window.localStorage.getItem("appAuthData");
const typeFromStorage = window.localStorage.getItem("typeData");

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      CartQty: 0,
      isUserLoggedIn: jwtFromStorage,
      typeValue: typeFromStorage,
      // typeContextValue: null
      items: [], // Data.Restaurants,
      hasNewOrders: false,
      loadNewOrderOnClick: false,
    };

    this.setUpNotification();
  }

  componentDidMount() {
    this.CartCounter();
    this.getDataRestaurants(); // render CartCounter() and then render this: 2 time !!!
  }

  CartCounter = (value = -1) => {
    if (Number(value) == 0) {
      this.setState({ CartQty: 0 });
      return;
    }

    let StorageCart = localStorage.getItem("ShoppingCart");
    StorageCart = JSON.parse(StorageCart);
    let CartQty = 0;
    if (Array.isArray(StorageCart)) {
      CartQty = StorageCart.reduce((Total, Current) => Total + Current.qty, 0);
    }
    this.setState({ CartQty: CartQty });
  };

  getDataRestaurants() {
    axios
      .get(API_ADDRESS + "/restaurants")
      .then((res) => {
        this.setState({ items: res.data.Restaurants });
      })
      .catch((err) => console.log(err));
  }

  setHasNewOrders = (value) => {
    this.setState({ hasNewOrders: value });
  };

  setLoadNewOrderOnClick = (value) => {
    this.setState({ loadNewOrderOnClick: value });
  };

  setUpNotification = () => {
    setInterval(() => {
      const token = window.localStorage.getItem("appAuthData");
      if (!token || jwt.decode(token).account_type == 1) {
        // guess view or customer view
        return;
      }

      axios
        .get(`${API_ADDRESS}/orders/myLatestOrderDate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          let latestOrderDate = localStorage.getItem("latestOrderDate");
          if (latestOrderDate === null) {
            return;
          }

          latestOrderDate = new Date(JSON.parse(latestOrderDate)).getTime();
          const apiLatestOrderDate = new Date(res.data.latest_date).getTime();

          if (latestOrderDate < apiLatestOrderDate) {
            // console.log("this.context", this.context);
            if (this.context) this.setHasNewOrders(true);
          } else {
            // console.log("this.context 222", this);
            if (this.context) this.setHasNewOrders(false);
          }
        })
        .catch(console.error);
    }, 1000);
  };

  render() {
    return (
      <BrowserRouter>
        <div className={styles.App}>
          <Nav
            CartQty={this.state.CartQty}
            restaurants={this.state.items}
            nav={(newJwt) => {
              // <Nav CartQty={this.state.CartQty} restaurants={ Data.restaurants } nav = {(newJwt => {
              this.setState({ isUserLoggedIn: newJwt });
            }}
            userLoggedIn={this.state.isUserLoggedIn}
            navType={(newTypeJwt) => {
              this.setState({ typeValue: newTypeJwt });
            }}
            hasNewOrders={this.state.hasNewOrders}
            setLoadNewOrderOnClick={this.setLoadNewOrderOnClick}
          />

          <CartContext.Provider value={{ CartCounter: this.CartCounter }}>
            <RouterURL
              userLoggedIn={this.state.isUserLoggedIn}
              restaurants={this.state.items}
              typeValue={this.state.typeValue}
              hasNewOrders={this.state.hasNewOrders}
              loadNewOrderOnClick={this.state.loadNewOrderOnClick}
              setLoadNewOrderOnClick={this.setLoadNewOrderOnClick}
            />
          </CartContext.Provider>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}
