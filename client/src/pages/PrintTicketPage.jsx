import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const TicketReceipt = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:5000/api/orders/${orderId}`) // fetch by order id
            .then(res => res.json())
            .then(data => setOrder(data));
    }, [orderId]);

    if (!order) return <p className="p-10 text-center">Loading...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto font-sans">
            {/* Navigate back to orders */}
            <div className="mb-8 flex justify-between print:hidden border-b pb-4">
                <button onClick={() => navigate(-1)} className="text-sm underline">Back to Orders</button>
                <button 
                    onClick={() => window.print()} // use to open save to pdf
                    className="bg-black text-white px-4 py-2 text-sm font-bold rounded"
                >
                    Print PDF
                </button>
            </div>

            {/* Ticket Print field: name, event, status, username, date */}
            <div className="border-2 border-black p-8">
                <div className="flex justify-between items-baseline mb-6 border-b-2 border-black pb-4">
                    <h1 className="text-2xl font-bold uppercase tracking-tighter">Your Ticket</h1>
                    <p className="font-mono text-sm">ID: #{order.id}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs uppercase font-bold text-gray-500">Event</label>
                        <p className="text-xl font-semibold">{order.event_name}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500">Issued for</label>
                            <p>{order.user_name}</p>
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500">Price</label>
                            <p>£{order.total_price.toFixed(2)}</p>
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500">Status</label>
                            <p className="uppercase text-sm">{order.status}</p>
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-gray-500">Issued On</label>
                            <p>{new Date(order.order_timestamp).toLocaleDateString('en-GB')}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-black text-center">
                    <p className="text-xs text-gray-400 italic">Please present this receipt at the entrance.</p>
                </div>
            </div>
        </div>
    );
};

export default TicketReceipt;