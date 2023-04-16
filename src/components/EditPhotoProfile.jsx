import { useState, useContext } from "react";
import { Form, Modal, Alert } from "react-bootstrap";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";
import "../styles/home.css";

export default ({ isVisible, onHide, photoProfile, getUser }) => {
  const [form, setForm] = useState({
    image: "",
  });
  const [status, setStatus] = useState({});
  const [preview, setPreview] = useState("");
  const [state, dispatch] = useContext(UserContext);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleOnSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set(
        "image",
        form.image[0],
        form.image[0].name
      );

      await API.patch(`/user/${state.user.id}`, formData, config);

      setStatus({
        message:
          "Your profile picture has updated",
        error: false,
      });

      setTimeout(() => {
        onHide();
        setStatus({});
        getUser();
      }, 500);
    } catch (error) {
      console.log(error);
      setStatus({
        message: "Something went wrong with the server, please try again later",
        error: true,
      });
    }
  };

  return (
    <Modal
      centered
      show={isVisible}
      onHide={onHide}
      dialogClassName="info-modal-purchase"
    >
      <Modal.Body className="container-modal">
        {status.message && (
          <Alert variant={status.error ? "danger" : "success"}>
            {status.message}
          </Alert>
        )}
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit();
          }}
        >
          <div>
            <label
              htmlFor="input-photo"
              className="d-flex flex-row tombol-upload-payment"
            >
              <p>Choose file</p>
            </label>
            <input
              type="file"
              id="input-photo"
              onChange={handleOnChange}
              name="image"
              hidden
            />
          </div>
          {preview ? (
            <img
              src={preview}
              className="img-fluid rounded preview-payment"
              width="25%"
            />
          ) : (
            <img
              src={photoProfile}
              className="img-fluid rounded preview-payment"
              width="25%"
            />
          )}
          <button type="submit" className="tombol-add-payment">
            Update
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
