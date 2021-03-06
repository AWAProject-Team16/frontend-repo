import React, { useState } from "react";
import styles from "../css/_Common.module.css";
import axios from "axios";
import cx from "classnames";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_ADDRESS = process.env.REACT_APP_API_ADDRESS;

export default function RestaurantCreateNew() {
  const [filePickerLabelText, setFilePickerLabelText] = useState("Click to choose another image");
  const [imgSource, setImgSource] = useState("/images/placeholder.png");

  function showNewImageChosenFileName(e) {
    const filePicker = e.target;

    if (FileReader && filePicker.files && filePicker.files.length) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setImgSource(fileReader.result);
      };
      fileReader.readAsDataURL(filePicker.files[0]);
    }

    if (filePicker.files.length > 0) {
      setFilePickerLabelText(filePicker.files[0].name);
    } else {
      setFilePickerLabelText("Click to choose an image");
    }
  }

  function submit(e) {
    const form = e.target;
    e.preventDefault();

    const isDataValid =
      form.name.value.trim() != "" &&
      form.address.value.trim() != "" &&
      form.operating_hours.value.trim() != "" &&
      form.phonenumber.value.trim() != "" &&
      form.restaurant_type.value.trim() != "" &&
      form.price_level.value.trim() != "" &&
      form.restaurant_description.value.trim() != "" &&
      form.image.files.length > 0;

    if (!isDataValid) {
      toast.error("All data are required and price must be greater than 0");
    } else {
      const formData = new FormData(form);

      const token = localStorage.getItem("appAuthData");
      if (!token) {
        console.error("No app auth data");
        return;
      }
      axios
        .post(API_ADDRESS + "/restaurants/newRestaurantMultipart", formData, {
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            toast.success("Restaurant created.");
            form.reset();
          } else {
            toast.error("Something went wrong!");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          <form action="" name="createRestaurantForm" className={styles.form} onSubmit={submit}>
            <h3>Create A New Restaurant</h3>
            <div className={styles.formgroup}></div>
            <div className={styles.formwrapper}>
              <label htmlFor="">
                Restaurant Name
                <span htmlFor="" className={cx(styles.errormessage, "name")}>
                  Restaurant Name cannot be empty!
                </span>
              </label>
              <input type="text" className={styles.formcontrol} name="name" />
            </div>
            <div className={styles.formwrapper}>
              <label htmlFor="">Restaurant Address</label>
              <input type="text" className={styles.formcontrol} name="address" />
            </div>
            <div className={styles.formwrapper}>
              <label htmlFor="">Operating Hours</label>
              <textarea rows="12" className={cx(styles.formcontrol, styles.textarea)} name="operating_hours" />
            </div>
            <div className={styles.formwrapper}>
              <label htmlFor="">Phone Number</label>
              <input type="tel" className={styles.formcontrol} name="phonenumber" />
            </div>
            <div className={styles.formwrapper}>
              <label htmlFor="">Restaurant Type</label>
              <select className={cx(styles.formcontrol, styles.select)} name="restaurant_type">
                <option value="Buffet">Buffet</option>
                <option value="Fast food">Fast food</option>
                <option value="Fast casual">Fast casual</option>
                <option value="Casual dining">Casual dining</option>
                <option value="Fine dining">Fine dining</option>
              </select>
            </div>
            <div className={styles.formwrapper}>
              <label htmlFor="">Price Level</label>
              <select className={cx(styles.formcontrol, styles.select)} name="price_level">
                <option value="1">&euro;</option>
                <option value="2">&euro;&euro;</option>
                <option value="3">&euro;&euro;&euro;</option>
                <option value="4">&euro;&euro;&euro;&euro;</option>
              </select>
            </div>
            <div className={styles.formwrapper}>
              <label htmlFor="">Restaurant Description</label>
              <textarea rows="12" className={cx(styles.formcontrol, styles.textarea)} name="restaurant_description" />
            </div>
            <div className={styles.formwrapper}>
              <label htmlFor="">Image</label>
              <div>
                <img className={styles.productImage} src={imgSource} />
                <input
                  type="file"
                  accept="image/*"
                  className={cx(styles.formcontrol, styles.input_file)}
                  name="image"
                  id="file_picker"
                  onChange={showNewImageChosenFileName}
                />
                <label className={styles.formcontrol} htmlFor="file_picker">
                  {filePickerLabelText}
                </label>
              </div>
            </div>

            <button type="submit" className={styles.button}>
              Create
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}
