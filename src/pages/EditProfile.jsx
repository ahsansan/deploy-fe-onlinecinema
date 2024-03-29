// Import CSS
import "../styles/addfilm.css";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import Aos from "aos";
import "aos/dist/aos.css";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";

export default () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [state, dispatch] = useContext(UserContext);

  const router = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [status, setStatus] = useState({});

  const { fullName, email, phone } = form;

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const formData = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone
      }

      const formSubmit = JSON.stringify(formData);

      await API.patch(`/user/${state.user.id}`, formSubmit, config);

      const response = await API.get("/check-auth");

      Swal.fire("Good job!", "Update Success", "success");

      let payload = response.data.data.user;
      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });

      router("/profile");
    } catch (error) {
      console.log(error);
      setStatus({
        message: "Something went wrong with the server, please try again later",
        error: true,
      });
    }
  };

  const getUser = async () => {
    try {
      const response = await API.get(`user/${state.user.id}`);
      const user = response.data.data.user;

      setForm({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [state.user.id]);

  return (
    <Container className="mt-5" data-aos="fade-up">
      <h1 className="mb-4 judul-add-film">Edit Profile</h1>
      {status.message && <Alert variant="danger">{status.message}</Alert>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOnSubmit();
        }}
      >
        {/*<div className="preview-film">
          {preview ? (
            <img src={preview} className="img-fluid rounded" width="30%" />
          ) : (
            <img src={image} className="img-fluid rounded" width="30%" />
          )}
        </div>
        <div>
          <label htmlFor="input-photo" className="tombol-add-pp">
            <p>Upload Profile Pitcure</p>
          </label>
          <input
            type="file"
            id="input-photo"
            onChange={handleOnChange}
            name="image"
            hidden
          />
        </div>*/}
        <div>
          <input
            type="text"
            name="fullName"
            id="fullName"
            onChange={handleOnChange}
            value={fullName}
            className="normal-input-addfilm"
            placeholder="Name"
          />
        </div>
        <div>
          <input
            type="text"
            name="email"
            id="email"
            onChange={handleOnChange}
            value={email}
            className="normal-input-addfilm"
            placeholder="email"
          />
        </div>
        <div>
          <input
            type="number"
            name="phone"
            id="phone"
            placeholder="Phone"
            className="normal-input-addfilm"
            onChange={handleOnChange}
            value={phone}
          />
        </div>
        <div className="save-button-container">
          <button type="submit" className="btn-add-film">
            Save Profile
          </button>
        </div>
      </form>
    </Container>
  );
};
