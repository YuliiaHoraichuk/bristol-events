import { useParams } from 'react-router-dom';

const UserPage = () => {
    const { username } = useParams();

    // TEMP DATA
    const orders = [
        { name: 'Test 1', price: '£25.00', date: '2026-10-01', status: 'Completed' },
        { name: 'Test 2', price: '£40.00', date: '2026-10-05', status: 'Cancelled' },
    ];

    return (
        <div className="min-h-[80vh] p-10">
            <h1 className="text-3xl font-bold mb-6">Welcome, {username}!</h1>
            <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>

            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold">Order</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4">{order.name}</td>
                                <td className="p-4 font-medium">{order.price}</td>
                                <td className="p-4 text-gray-600">{order.date}</td>
                                <td className={`p-4 font-bold ${order.status === 'Completed' ? 'text-green-600' : 'text-red-500'}`}>
                                    {order.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )

};

export default UserPage;