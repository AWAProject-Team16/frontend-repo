import React from "react";
import styles from "../css/RestaurantsSearchResult.module.css";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import Restaurants from "./Restaurants";

export default function RestaurantsCategories(props) {
  // This is a set of restaurants of the same food type (aka restaurant type)

  const result = useParams();

  if (result == null) {
    return <div>No restaurants</div>;
  }

  let typefilter = MakeFilter();

  function MakeFilter() {
    if (result.foodtype === "Fast-food") {
      return "fast food";
    } else if (result.foodtype === "Buffet") {
      return "buffet";
    } else if (result.foodtype === "Fast-casual") {
      return "fast casual";
    } else if (result.foodtype === "Casual-dining") {
      return "casual dining";
    } else if (result.foodtype === "Fine-dining") {
      return "fine dining";
    }
  }

  const filteredRestaurants = FilterRestaurants(props.restaurants, typefilter);

  function FilterRestaurants(arr, foodtype) {
    return arr.filter(function (item) {
      return item.restaurant_type.toLowerCase().indexOf(foodtype.toString().toLowerCase()) !== -1;
    });
  }

  return (
    <div>
      <div>
        <Restaurants restaurants={filteredRestaurants} />
      </div>
    </div>
  );
}
