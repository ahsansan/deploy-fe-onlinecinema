import { useState, useEffect } from "react";
import { Alert, Modal, Form } from "react-bootstrap";
import { API } from "../config/api";
import "../styles/addfilm.css";

export default ({ show, handleClose, idFilm }) => {
  const [form, setForm] = useState({
    tumbnail: "",
  });

  const [status, setStatus] = useState({});

  const [preview, setPreview] = useState("");

  useEffect(() => {
    getFilm();
  }, []);

  const getFilm = async () => {
    try {
      const resp = await API.get(`/film/${idFilm}`);
      const { film } = resp.data.data;
      setForm({
        tumbnail: `${film.tumbnail}`,
      });
    } catch (err) {
      setStatus({
        message: "Can't get film data",
        error: true,
      });
    }
  };

  const onChange = (e) => {
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
      formData.set("tumbnail", form.tumbnail[0], form.tumbnail[0].name);

      await API.patch(`/film/${idFilm}`, formData, config);

      setStatus({
        message: "Your film is successfully updated",
        error: false,
      });

      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.log(err);
      setStatus({
        message: "Something went wrong with the server, please try again later",
        error: true,
      });
    }
  };

  return (
    <Modal
      dialogClassName="info-modal"
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Body>
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
          <div className="d-flex align-items-center">
            <div>
              <label
                htmlFor="tumbnail"
                className="d-flex flex-row tombol-tumbnail"
              >
                <p style={{ marginTop: "15px" }}>Attach Tumbnail</p>
                <img
                  src="/Frame1.svg"
                  alt="frame"
                  width={25}
                  height={25}
                  style={{ marginLeft: "5px" }}
                />
              </label>
              <input
                type="file"
                id="tumbnail"
                onChange={onChange}
                name="tumbnail"
                hidden
              />
            </div>
          </div>
          <div className="preview-film">
            {preview ? (
              <img
                src={preview}
                className="img-fluid rounded"
                alt="tumbnail"
                width="20%"
              />
            ) : (
              <img
                src={form.tumbnail}
                className="img-fluid rounded"
                alt="tumbnail"
                width="20%"
              />
            )}
          </div>
          <div className="d-flex flex-row-reverse">
            <button className="btn-add-film" type="submit">
              Edit Tumbnail
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
