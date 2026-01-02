import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../../utils/upload";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // handle sign up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Full name is required.");
      return;
    }

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError("");

    // Sign up api call
    try {
      if (profilePic) {
        const imageUploadesRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadesRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      updateUser(response.data);
      navigate("/dashboard");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        console.error(error);
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-md md:w-[33vw] p-2 flex flex-col justify-center overflow-y-auto max-h-screen">
      <h3 className="text-lg md:text-xl font-semibold text-black">
        Create an Account
      </h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Username"
            placeholder="John Doe"
            type="text"
          />

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="John@example.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Min 6 characters"
            type="password"
          />
        </div>

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button type="submit" className="btn-primary">
          Sign Up
        </button>

        <p className="text-[13px] text-slate-800 mt-3">
          Already have an Account?{" "}
          <button
            className="font-medium underline cursor-pointer"
            onClick={() => {
              setCurrentPage("login");
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
