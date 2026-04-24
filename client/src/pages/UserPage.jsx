import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserPage = ({user}) => {
    const { username } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCancel = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
                method: 'PATCH'
            });

            if (response.ok) {
                // update state so the UI shows the change without a refresh
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
            }
        } catch (err) {
            console.error("Cancellation error:", err);
        }
    };

    useEffect(() => {
        console.log("UserPage useEffect user object:", user);
        if (user && user.id) {
            fetch(`http://localhost:5000/api/users/${user.id}/orders`)
                .then(res => {
                        if (!res.ok) throw new Error("Server responded with an error");
                        return res.json();
                    })
                    .then(data => {
                        setOrders(data);
                        setLoading(false); // End loading (trying to make sure it doesnt stuck)
                    })
                    .catch(err => {
                        console.error("Error fetching orders:", err);
                        setLoading(false); // Set false or err
                    });
            } else {
                // Set false if there's no user
                setLoading(false);
            }
    }, [user]);


    if (loading) return <div className="p-20 text-center">Loading orders...</div>;

    return (
        <div className="min-h-[80vh] p-10 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Welcome back, {username}!</h1>
            
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

            {orders.length === 0 ? (
                <div className="p-10 border-2 border-dashed rounded-2xl text-center text-gray-400">
                    You haven't booked any events yet.
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Event</th>
                                <th className="p-4 font-semibold text-gray-600">Total Price</th>
                                <th className="p-4 font-semibold text-gray-600">Date Booked</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">{order.event_name}</td>
                                    <td className="p-4 font-medium">£{order.total_price.toFixed(2)}</td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {new Date(order.order_timestamp).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            order.status === 'fulfilled' ? 'text-green-700' : 
                                            order.status === 'pending' ? 'text-yellow-700' : 
                                            ' text-red-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    {/* Action Buttons: Print and Cnacel */}
                                    <td className="p-4 text-right">
                                        <Link 
                                            to={`/ticket/${order.id}`} 
                                            className="text-xs font-bold text-accent hover:underline uppercase"
                                            >
                                                Print Ticket
                                        </Link>
                                        {order.status !== 'cancelled' && (
                                            <button 
                                                onClick={() => handleCancel(order.id)}className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-tight"
                                            > Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserPage;