import { useState } from "react";
import { useNavigate } from "react-router-dom";

// object state, to hold form data and update
const Signup = ({ setUser }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // on input change, update formData state with the new value:corresponding field
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        // Frontend Validation: DON'T send reuquest if passwords don't match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser({ name: data.username, isAdmin: data.isAdmin });
                navigate("/"); // Send to the home page
            } else {
                setError(data.error || "An error occurred during signup.");
            }
        } catch (err) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        // wrapper
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            // form container
            <div className="w-full max-w-sm p-6 border rounded-lg bg-white">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
                <form onSubmit={handleSignup} className="space-y-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <input 
                        name="username" type="text" placeholder="Username" required
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input 
                        name="email" type="email" placeholder="Email" required
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input 
                        name="password" type="password" placeholder="Password" required
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <input 
                        name="confirmPassword" type="password" placeholder="Confirm Password" required
                        className="w-full p-2 border rounded"
                        onChange={handleChange}
                    />
                    <button type="submit" className="w-full bg-accent text-white py-2 rounded hover:bg-accent/90">
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;