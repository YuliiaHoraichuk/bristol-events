import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import { tempEventData } from '../temp_data/TempEventData';

const Home = () => {
    const categories = ["Music", "Family", "Food & Drink", "Outdoors", "Arts & Culture", "Spiritual", "Nightlife", "Workshops"];
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false); // setter function to toggle filter on mobile
    // Fiters
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [priceType, setPriceType] = useState("All");
    const [searchDate, setSearchDate] = useState("");

    // CLEAR ALL FILTERS
    const clearAllFilters = () => {
        setSelectedCategory("All");
        setPriceType("All");
        setSearchDate("");
    };

    // FILTERED: only event that match filters
    const filteredEvents = events.filter(event => {
    // Category Filter
    const categoryMatch = selectedCategory === "All" || event.category === selectedCategory;

    // Price Filter
    const isFree = event.price_base === 0;
    const priceMatch = 
        priceType === "All" || 
        (priceType === "Free" && isFree) || 
        (priceType === "Paid" && !isFree);

    // Date Filter
    const dateMatch = !searchDate || event.start_date.includes(searchDate);

    return categoryMatch && priceMatch && dateMatch;
});

    useEffect(() => {
        fetch("http://localhost:5000/api/events")
            .then(res => res.json())
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching events from the dattabase:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="flex flex-col md:flex-row gap-8 py-1">
        {/* Mobile Filter Button */}
        <div className="md:hidden px-4">
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-accent hover:text-white hover:bg-accent border border-accent text-md font-semibold rounded-full px-6 py-1"
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
        </div>
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0`}>
            <div className="sticky top-24 border p-4 rounded-lg bg-gray-50">
                <h2 className="text-xl font-bold mb-4">Filters</h2>
                {/* Clear Filters Button */}
                    <button 
                        onClick={clearAllFilters}
                        className=" py-2 mb-3 text-s px-4 border rounded-lg text-gray-500 hover:underline font-semibold"
                    >
                        Clear filters
                    </button>

                {/* Categories */}
                <div className="mb-8">
                    <h3 className="font-semibold mb-2">Categories</h3>
                    <ul className="space-y-2">
                        {categories.map((category, index) => (
                            <li 
                                key={index} 
                                onClick={() => setSelectedCategory(category)}
                                className={`text-left px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                                    selectedCategory === category ? 'bg-accent text-white' : 'text-accent hover:bg-accent/10'
                                }`}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Date */}
                <div className="mb-8">
                    <h3 className="font-semibold mb-2">Date</h3>
                    <div className="flex flex-col gap-2">
                        {["Today", "Tomorrow", "This Weekend"].map((time) => (
                            <button key={time} className="text-left px-3 py-1.5 rounded-md hover:bg-accent/10 hover:text-accent text-gray-600 transition-all text-m">
                                {time}
                            </button>
                        ))}
                        <input 
                            type="date" 
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            className="mt-2 w-full p-2 border rounded-md text-sm text-gray-600 focus:outline-accent"
                        />
                    </div>
                </div>

                {/* Price */}
                <div className="mb-8">
                    <h3 className="font-semibold mb-2">Price</h3>
                    <div className="space-y-2">
                        {["Free", "Paid"].map((type) => (
                            <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                <input 
                                    type="radio" // Either free or paid, can't be both
                                    name="price"
                                    checked={priceType === type}
                                    onChange={() => setPriceType(type)}
                                    className="w-4 h-4 text-accent" 
                                />
                                <span className="text-gray-600">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </aside>

            {/* Main Content */}
            <section className="grow py-3">
                <h1 className="text-xl mb-6">All Events/</h1>
                <div className="flex flex-col gap-4">
                    {loading ? (<p className="text-center p-10">Loading...</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            ) : (
                            <p className="text-gray-500 italic p-10 text-center">No events match your filters.</p>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;