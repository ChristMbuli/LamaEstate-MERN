import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profileUpdate.scss";
import { AuthContext } from "../../context/AuthContext.jsx";
import apiRequest from "../../lib/apiRequest.js";
import UploadWidget from "../../components/widget/UploadWidget.jsx";

const ProfileUpdate = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [profil, setProfile] = useState([]);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault;

    const formData = new FormData(e.target);

    const { fname, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/${currentUser.id}`, {
        fname,
        email,
        password,
        profil: profil[0],
      });
      updateUser(res.data);
      //console.log(res.data);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    }
  };

  return (
    <div className="profilUpdate">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update profile</h1>
          <input
            name="fname"
            required
            type="text"
            placeholder="Nom complet"
            defaultValue={currentUser.fname}
          />
          <input
            name="email"
            required
            type="text"
            placeholder="Email"
            defaultValue={currentUser.email}
          />
          <input
            name="password"
            minLength={8}
            type="password"
            placeholder="Password"
          />
          <button>Update</button>
        </form>
      </div>
      <div className="imgContainer">
        <img
          src={
            profil[0] ||
            currentUser.profil ||
            "https://oasys.ch/wp-content/uploads/2019/03/photo-avatar-profil.png"
          }
          alt=""
        />
        <UploadWidget
          uwConfig={{
            //sources: ["local", "url"],
            cloudName: "do2qwucmp",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 2000000,
            folder: "profiles",
          }}
          setState={setProfile}
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;
