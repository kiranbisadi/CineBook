import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();

  // "user" or "theatreOwner"
  const [accountType, setAccountType] = useState("user");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const endpoint =
      accountType === "theatreOwner"
        ? "/auth/register/theatre-owner"
        : "/auth/register";

    // Only send the fields each endpoint needs
    const payload =
      accountType === "theatreOwner"
        ? formData
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          };

    try {
      const response = await api.post(endpoint, payload);

      setMessage(
        accountType === "theatreOwner"
          ? "Registered! Your account is waiting for admin approval."
          : response.data.message
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        businessName: "",
        address: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>

        {/* Account type toggle */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setAccountType("user")}
            className={`flex-1 p-2 rounded ${
              accountType === "user"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setAccountType("theatreOwner")}
            className={`flex-1 p-2 rounded ${
              accountType === "theatreOwner"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Theatre Owner
          </button>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded"
          required
        />

        {accountType === "theatreOwner" && (
          <>
            <input
              type="text"
              name="businessName"
              placeholder="Business name"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border p-3 mb-4 rounded"
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Business address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-3 mb-4 rounded"
              required
            />
          </>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-3 mb-4 rounded"
          required
        />

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-red-600 text-white p-3 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
