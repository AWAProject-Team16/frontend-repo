import React from "react";
import TotalCostBox from "./Totalcost";
import ProductArea from "./ProductArea";
import styles from "./../css/ShoppingCart/ShoppingCart.module.css";
import DeliveryLocation from "./DeliveryLocation";
import { CartContext } from "../context/Contexts";
import { useNavigate } from "react-router-dom";

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ShoppingCart: [],
      ProductCosts: 0,
      TotalCost: 0,
      DeliveryForm: "",
      DeliveryLocation: "",
      DeliveryCost: 0,
      isLocationSubmitted: false,
      isUserLoggedin: null,
    };
  }

  static contextType = CartContext;

  componentDidMount() {
    let StorageCart = [];
    StorageCart = localStorage.getItem("ShoppingCart");
    StorageCart = JSON.parse(StorageCart);
    this.setState({ ShoppingCart: StorageCart });
    const ProductCostCalc = function (arr) {
      return arr.reduce((total, i) => {
        return total + i.cost * i.qty;
      }, 0);
    };
    let ProductCosts = 0;
    if (StorageCart) {
      ProductCosts = ProductCostCalc(StorageCart);
    }
    this.setState({ ProductCosts: ProductCosts, TotalCost: ProductCosts });

    let accountype = null;
    accountype = localStorage.getItem("typeData");
    this.setState({ isUserLoggedin: accountype });
  }

  IncreaseAmount = (id, cost) => {
    let NewShoppingCart = [...this.state.ShoppingCart];
    let indexnumber = this.Indexfinder(NewShoppingCart, id);
    NewShoppingCart[indexnumber].qty += 1;
    let NewCost = this.state.ProductCosts;
    NewCost = NewCost + cost;
    NewCost = parseFloat(NewCost.toFixed(2));
    let NewTotalCost = NewCost + this.state.DeliveryCost;
    this.setState({ ShoppingCart: NewShoppingCart, ProductCosts: NewCost, TotalCost: NewTotalCost });
    localStorage.setItem("ShoppingCart", JSON.stringify(this.state.ShoppingCart));
    this.context.CartCounter();
  };

  DecreaseAmount = (id, cost) => {
    let NewShoppingCart = [...this.state.ShoppingCart];
    let indexnumber = this.Indexfinder(NewShoppingCart, id);

    if (NewShoppingCart[indexnumber].qty > 1) {
      NewShoppingCart[indexnumber].qty -= 1;
      let NewCost = this.state.ProductCosts;
      NewCost = NewCost - cost;
      NewCost = parseFloat(NewCost.toFixed(2));
      let NewTotalCost = NewCost + this.state.DeliveryCost;
      this.setState({ ShoppingCart: NewShoppingCart, ProductCosts: NewCost, TotalCost: NewTotalCost });
      localStorage.setItem("ShoppingCart", JSON.stringify(this.state.ShoppingCart));
    }

    this.context.CartCounter();
  };

  DeleteProduct = (id, qty, cost) => {
    let NewShoppingCart = [...this.state.ShoppingCart];
    let indexnumber = this.Indexfinder(NewShoppingCart, id);
    NewShoppingCart.splice(indexnumber, 1);
    let NewCost = this.state.ProductCosts;
    let LostCost = qty * cost;
    NewCost = NewCost - LostCost;
    NewCost = parseFloat(NewCost.toFixed(2));
    let NewTotalCost = NewCost + this.state.DeliveryCost;
    this.setState({ ShoppingCart: NewShoppingCart, ProductCosts: NewCost, TotalCost: NewTotalCost });
    localStorage.setItem("ShoppingCart", JSON.stringify(NewShoppingCart));
    this.context.CartCounter();
  };

  AddProduct = (id, value, qty, cost) => {
    let StorageCart = localStorage.getItem("ShoppingCart");
    StorageCart = JSON.parse(StorageCart);
    if (Array.isArray(StorageCart)) {
      let indexnumber = StorageCart.findIndex((Product) => Product.id === id);
      if (indexnumber === -1) {
        StorageCart.push({ id: id, value: value, qty: qty, cost: cost });
      } else {
        StorageCart[indexnumber].qty += qty;
      }
      localStorage.setItem("ShoppingCart", JSON.stringify(StorageCart));
    } else {
      let StorageCart = [];
      StorageCart.push({ id: id, value: value, qty: qty, cost: cost });
      localStorage.setItem("ShoppingCart", JSON.stringify(StorageCart));
    }
    this.context.CartCounter();
    localStorage.setItem("Restaurant", JSON.stringify({ Restaurant: "MacDonalds", RestaurantID: 2 }));
  };

  Indexfinder(ArraytoSearch, id) {
    return ArraytoSearch.findIndex((Item) => Item.id === id);
  }

  UpdateLocation = (event) => {
    this.setState({ DeliveryForm: event.target.value });
  };

  LocationSubmitted = (event) => {
    event.preventDefault();
    const DeliveryCost = 5;
    let NewCost = this.state.ProductCosts;
    NewCost = NewCost + DeliveryCost;
    let DeliveryLocation = this.state.DeliveryForm;
    localStorage.setItem("DeliveryLocation", DeliveryLocation);
    localStorage.setItem("DeliveryCost", DeliveryCost);
    this.setState({ isLocationSubmitted: true, DeliveryCost: DeliveryCost, TotalCost: NewCost, DeliveryLocation: DeliveryLocation });
  };

  PaymentClicked = () => {
    if (this.state.isLocationSubmitted === false) {
      alert("Please input delivery location before proceeding to payment");
    } else {
      this.props.navigateHook("/paymentpage");
    }
    if (this.state.isUserLoggedin == null) {
      alert("Please login or register first");
    }
  };

  render() {
    return (
      <div className={styles.CheckoutArea}>
        <h1 className={styles.CheckoutTitle}>Checkout</h1>
        <div className={styles.CheckoutContent}>
          <ProductArea
            Products={this.state.ShoppingCart}
            ProductCosts={this.state.ProductCosts}
            IncreaseAmount={this.IncreaseAmount}
            DecreaseAmount={this.DecreaseAmount}
            DeleteProduct={this.DeleteProduct}
          />
          <div className={styles.CheckoutInfo}>
            <DeliveryLocation
              DeliveryForm={this.state.DeliveryForm}
              DeliveryLocation={this.state.DeliveryLocation}
              DeliveryCost={this.state.DeliveryCost}
              UpdateLocation={this.UpdateLocation}
              LocationSubmitted={this.LocationSubmitted}
              isLocationSubmitted={this.state.isLocationSubmitted}
            />
            <TotalCostBox
              ProductCosts={this.state.ProductCosts}
              DeliveryCost={this.state.DeliveryCost}
              TotalCost={this.state.TotalCost}
            />
            <div>
              <button
                className={styles.PaymentButton}
                onClick={() => this.PaymentClicked()}
                style={{ backgroundColor: this.state.isLocationSubmitted === true ? "rgb(177, 231, 97)" : "grey" }}
              >
                <span className={styles.PaymentLink}>Proceed to payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function WithUseNavigate(props) {
  const navigateHook = useNavigate();
  return <ShoppingCart {...props} navigateHook={navigateHook} />;
}

export default WithUseNavigate;
