import React, { useState, useEffect, createRef } from "react";
import styles from "../css/_Common.module.css";
import axios from "axios";
import cx from "classnames";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_ADDRESS = process.env.REACT_APP_API_ADDRESS;

export default function CategoryModify(props) {
  const [data, setData] = useState({
    idcategories: 0,
    restaurants_idrestaurants: 0,
    category_name: "",
    restaurant_name: "",
  });

  const [isDisabled, setIsDisable] = useState(true);

  const idcategories = useParams().idcategories || props.idcategories;

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("appAuthData");
      if (!token) {
        console.error("App auth data not found");
        return;
      }
      try {
        const res = await axios.get(`${API_ADDRESS}/categories/categoryInfoWithRestaurantName/${idcategories}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data[0]);
        setIsDisable(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const idrestaurants = data.restaurants_idrestaurants;
    const categoryName = e.target.name.value.trim();

    if (!categoryName) {
      toast.error("Category name is required.");
      return;
    } else {
      const token = localStorage.getItem("appAuthData");

      if (!token) {
        console.error("App auth data not found");
        return;
      }

      axios
        .post(
          `${API_ADDRESS}/categories/restaurant/${idrestaurants}/category/${idcategories}/renameCategory`,
          { name: categoryName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            toast.success("Category modified.");
          } else {
            toast.error("Something went wrong!");
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <form action="" name="modifyCategory" className={styles.form} onSubmit={submit}>
            <h3>Modify A Category</h3>
            <div className={styles.formgroup}></div>
            <div className={styles.formwrapper}>
              <label htmlFor="">
                Category Name
                <span htmlFor="" className={cx(styles.errormessage, "name")}>
                  Category Name cannot be empty!
                </span>
              </label>
              <input
                disabled={isDisabled}
                required
                type="text"
                className={styles.formcontrol}
                name="name"
                value={data.category_name}
                onChange={(e) => setData({ ...data, category_name: e.target.value })}
              />
            </div>
            <div className={styles.formwrapper}>
              <label htmlFor="">This category belongs to the restaurant</label>
              <div className={styles.flex}>
                <input
                  disabled
                  type="text"
                  className={cx(styles.formcontrol, styles.ban)}
                  name="restaurant_name"
                  value={data.restaurant_name}
                />
              </div>
            </div>

            <button type="submit" className={styles.button}>
              Save
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
