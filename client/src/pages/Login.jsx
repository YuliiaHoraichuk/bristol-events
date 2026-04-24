import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // navigate vs link

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Empty str to clear previous errors
        
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                //setUser({ id: data.id, name: username, isAdmin: data.isAdmin });
                // Save user in local storage
                const userData = { id: data.id, name: username, isAdmin: data.isAdmin };
                localStorage.setItem('user', JSON.stringify(userData)); // Save to browser memory
                setUser(userData);
                navigate(data.isAdmin ? '/admin' : `/user/${username}`);
            } else {
                setError(data.error); // invalid username or password, show error message from backend
            }
        } catch (err) {
            setError('Login is unsuccessful. Please try again later.');
        }
    };

    return (
        // Wrapper div to center, input fields and buttons inside + hidden error div
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="w-full max-w-sm p-6 border rounded-lg bg-white">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Display error */}
                    {/* React conditional rendering, pretty neat: return nothing if error is empty otherwise render */}
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <input 
                        type="text" 
                        placeholder="Username"
                        className="p-2 border rounded"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password"
                        className="p-2 border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="w-full bg-accent text-white py-2 rounded hover:bg-accent/90 transition-all"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;