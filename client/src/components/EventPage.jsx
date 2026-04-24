import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const EventPage = ({user}) => {
    // Hooks and state to fetch and display event details
    const { id } = useParams(); // get the event ID from the url
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Ticket purchase logic
    const [quantity, setQuantity] = useState(1); // TO-DO
    const [isStudent, setIsStudent] = useState(false);

    // Payment info; isn't used in backend
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');

    const fetchEventData = () => {
        fetch(`http://localhost:5000/api/events/${id}`)
            .then(res => res.json())
            .then(data => {
                setEvent(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    };

    // When component mounts, call fetchEventData()
    // Having it declared inside useEffect leads to scope errors
    useEffect(() => {
        fetchEventData();
    }, [id]);

    // Calculate price based on discount tiers
    const calculateTotalPrice = () => {
        if (!event) return "0.00"; // safeguard

        const price_base = Number(event.price_base || 0);
        // defensive access: event.discounts may be undefined in some responses
        const studentPct = event?.discounts?.student_percent ?? 0;
        const timePct = event?.discounts?.time_percent ?? 0;

        // If student? apply; otherwise apply tiers
        const calculatedDiscountPercent = isStudent ? studentPct : timePct;

        const qty = Number(quantity) || 0;
        const multiplier = (100 - Number(calculatedDiscountPercent)) / 100;
        return (price_base * qty * multiplier).toFixed(2);
    }

    const totalPrice = calculateTotalPrice();

    // B
    const handlePlaceOrder = async () => {
        // Don't allow to place orders if not logged in
        console.log(user.id)
        if (!user || !user.id) {
            alert("Please log in to purchase tickets.");
            return;
        }
        // To ensure no empty orders placed
        if (quantity < 1) return alert("Your order cannot be less than one ticket.");

        const orderData = {
            event_id: event.id,
            user_id: user.id,
            quantity: parseInt(quantity),
            is_student: isStudent,
            total_price_frontend: totalPrice, // shown in the modal
            payment_name: cardName,
            payment_card: cardNumber
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Order placed successfully!");
                setIsModalOpen(false);
                // Update ticket count
                fetchEventData(); 
            } else {
                alert(`Error: ${result.error || "Could not place order"}`);
            }
        } catch (err) {
            console.error("Order error:", err);
            alert("An error occured. Please try again later.");
        }
    };

    // COnditional rendering for loading and error states
    if (loading) return <div className="p-20 text-center">Loading event details...</div>;
    if (!event) return <div className="p-20 text-center text-red-500 font-bold">Event not found.</div>;

    return (
        /* Container */
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
            
            {/* HEADER SECTION: category, venue, name */}
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-accent font-bold text-sm uppercase tracking-widest">
                        {event.category}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">{event.venue}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                    {event.name}
                </h1>
            </header>

            {/* IMAGE WRAPPER */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden mb-10 shadow-lg border border-gray-100">
                <img 
                    src={event.img_filename ? `http://localhost:5000/static/uploads/${event.img_filename}` : 'https://via.placeholder.com/1200x600'} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* TWO-COLUMNS: 1 Sidebar, 2 Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                
                {/* 1: Price, Tickets, Buy Button */}
                <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
                    <div className="p-8 border border-gray-100 rounded-3xl bg-gray-50/50 backdrop-blur-sm shadow-sm">
                        
                        {/* Price, Available */}
                        <div className="text-3xl font-bold text-gray-900 mb-2">£{event.price_base.toFixed(2)}</div>
                        <div className="text-sm text-gray-500 mb-6">{event.tickets_left} tickets remaining</div>
            
                        {/* Change btn if event sold out */}
                        <button 
                            onClick={() => setIsModalOpen(true)} // Purchase modal
                            disabled={event.tickets_left <= 0}
                            className={`w-full py-4 rounded-xl font-bold transition-all mb-6 shadow-md ${
                                event.tickets_left > 0 ? 'bg-accent text-white hover:bg-accent/90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {event.tickets_left > 0 ? 'Get Tickets' : 'Sold Out'}
                        </button>

                        {/* Event start and end*/}
                        <div className="space-y-4 text-sm border-t pt-6">
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium"> Event Starts</span>
                                <span className="font-semibold text-gray-900">{event.start_date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500 font-medium">Event Ends</span>
                                <span className="font-semibold text-gray-900">{event.end_date}</span>
                            </div>
                        </div>
                    </div> 
                </aside>

                {/* 2 CONTENT */}
                <main className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">About the Event</h2>
                    <div className="text-gray-600 space-y-4 leading-relaxed text-lg">
                        <p>{event.description}</p>
                    </div>
                </main>

            </div> 

            {/* Modal to purchase ticket: discount, is_full_pass, card data */}                    
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    
                    {/* The Modal Card */}
                    <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsModalOpen(false)} 
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                        >✕</button>
                        
                        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

                        {/* Ticket Quantity */}
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Quantity</label>
                            <input 
                                type="number" 
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                            />
                        </div>

                        {/* Student Discount */}
                        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors mb-8">
                            <input 
                                type="checkbox" 
                                checked={isStudent} 
                                onChange={() => setIsStudent(!isStudent)}
                                className="w-5 h-5 accent-accent"
                            />
                            <span className="font-semibold text-gray-700 text-sm">I am a student ({event?.discounts?.student_percent ?? 0}% discount)
                            </span>
                        </label>

                        {/* Summary and Purchase Button */}
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500 font-medium">Total Price</span>
                                <span className="text-3xl font-black text-gray-900">£{totalPrice}</span>
                            </div>

                            {/* Payment input */}
                            <div className="space-y-4 mb-8">
                                {/* Cardholder name */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                                        Cardholder Name
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="John Doe"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2                        focus:ring-accent outline-none bg-gray-50/30"
                                    />
                                </div>
                                {/* Card */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                                        Card Number
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="0000 0000 0000 0000"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2                        focus:ring-accent outline-none bg-gray-50/30"
                                    />
                                </div>
                            </div>
                            
                            <button 
                                className="w-full bg-accent text-white py-4 rounded-2xl font-bold hover:bg-accent/90 shadow-lg"
                                onClick={handlePlaceOrder}
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div> 
            )}

        </div> 
    );
};

export default EventPage;