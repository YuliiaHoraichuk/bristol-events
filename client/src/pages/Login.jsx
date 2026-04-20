import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // navigate vs link

    const handleLogin = (e) => {
        e.preventDefault();

        if (password === 'password') {
        //if (username === 'admin') {
        //    navigate('/admin');
        //} 
            setError(''); // clear error msg FIND BETTER WAY TO-DO
            setUser({ name: username, isAdmin: username === 'admin' });
            navigate(username === 'admin' ? '/admin' : `/user/${username}`);
        }
        else {
            setError('Invalid username or password');
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