import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetch("http://localhost:5000/api/users");
				const data = await response.json();
				setUsers(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching users:", error);
				setLoading(false);
			}
		};

		fetchUsers();
	}, []);

	if (loading) {
		return <div className="max-w-6xl mx-auto mt-10 px-4">Loading Users...</div>;
	}

	return (
		<div className="max-w-6xl mx-auto mt-10 px-4">
			<h1 className="text-2xl font-bold mb-6">Users</h1>
			<table className="w-full border-collapse">
				<thead>
					<tr>
						<th className="border p-2 text-left">ID</th>
						<th className="border p-2 text-left">Username</th>
						<th className="border p-2 text-left">Email</th>
						<th className="border p-2 text-left">Is Admin</th>
						<th className="border p-2 text-left">Orders</th>
						<th className="border p-2 text-left">Total Spent</th>
					</tr>
				</thead>
				<tbody>
					{users.map(user => (
						<tr key={user.id}>
							<td className="border p-2">{user.id}</td>
							<td className="border p-2">{user.username}</td>
							<td className="border p-2">{user.email}</td>
							<td className="border p-2">{user.is_admin ? "Yes" : "No"}</td>
							<td className="border p-2">
								<Link to={`/admin/orders?userId=${user.id}&userName=${user.username}`}
								className="text-accent hover:underline mr-4"> View Orders </Link>
							</td>
							{/* Return 0 explicitly if no orders placed */}
							<td className="border p-2">£{(user.total_spent || 0).toFixed(2)}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default AdminUsers;
