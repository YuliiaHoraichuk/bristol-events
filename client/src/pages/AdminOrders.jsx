import { useState, useEffect} from "react";
import { useLocation } from "react-router-dom"; // for filter user id

const AdminOrders = () => {
	const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterUserId = queryParams.get("userId");
    const filterUserName = queryParams.get("userName");

	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]); // show only filtered orders

	const [timeFilter, setTimeFilter] = useState('all'); // month, 3 months, year, all
	const [statusFilter, setStatusFilter] = useState('all'); // fullfilled, pending, cancelled

	// Fetch data from backend
	useEffect(() => {
        fetch("http://localhost:5000/api/orders")
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error(err));
    }, []);

	// Filter logic: by user, by status, by time
	// Used derived state, returns dependency array (to monitor changes for filters)
	useEffect(() => {
	    let result = [...orders];

	    // Filter by user
	    if (filterUserId) {
	        result = result.filter(o => o.user_id === parseInt(filterUserId));
	    }

	    // Filter by status
	    if (statusFilter !== 'all') {
	        result = result.filter(o => o.status === statusFilter);
	    }

	    // Filter by time
	    if (timeFilter !== 'all') {
	        const now = new Date();
	        result = result.filter(o => {
	            const orderDate = new Date(o.order_timestamp);
				// slugs
	            if (timeFilter === 'month') return (now - orderDate) < (30 * 24 * 60 * 60 * 1000);
	            if (timeFilter === '3months') return (now - orderDate) < (90 * 24 * 60 * 60 * 1000);
	            if (timeFilter === 'year') return (now - orderDate) < (365 * 24 * 60 * 60 * 1000);
	            return true;
	        });
	    }

	    setFilteredOrders(result);
	}, [orders, timeFilter, statusFilter, filterUserId]);

	return (
		<div className="max-w-6xl mx-auto mt-10 px-4">
			<h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
			<div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-xl border">
				{/* Filter by time */}
				<div>
        			<label className="block text-xs font-bold text-gray-500 uppercase mb-2">Timeframe</label>
        			<div className="flex gap-2">
            		{['all', 'month', '3months', 'year'].map(t => (
                		<button 
                    		key={t}
                    		onClick={() => setTimeFilter(t)}
                    		className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${timeFilter === t ? 'bg-accent text-white' : 'bg-white border text-gray-600'}`}
						>
                    		{t === 'all' ? 'All Time' : t}
                		</button>
					))}
					</div>
				</div>
				{/* Filter by order status */}
				<div>
        			<label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
        			<select 
            			value={statusFilter} 
            			onChange={(e) => setStatusFilter(e.target.value)}
            			className="border p-1 rounded-lg text-sm outline-none focus:ring-2 focus:ring-accent"
					>
            			<option value="all">All</option>
            			<option value="pending">Pending</option>
            			<option value="fulfilled">Fulfilled</option>
            			<option value="cancelled">Cancelled</option>
        			</select>
				</div>
			</div>
			{/* Table of orders */}
			<div className="overflow-x-auto border rounded-xl shadow-sm bg-white">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">User</th>
                            <th className="p-4">Event</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-500">#{order.id}</td>
                                    <td className="p-4 font-medium">{order.user_name}</td>
                                    <td className="p-4">{order.event_name}</td>
                                    <td className="p-4 font-bold">£{Number(order.total_price).toFixed(2)}</td>
                                    <td className="p-4 text-sm">{new Date(order.order_timestamp).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                                            order.status === 'fulfilled' ? 'bg-green-100 text-green-700' : 
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-10 text-center text-gray-500">
                                    No orders found that mathch the criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
		</div>
	);
};

export default AdminOrders;
