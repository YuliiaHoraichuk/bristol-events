import { useState } from 'react';
import EventCard from '../components/EventCard';
import { tempEventData } from '../temp_data/TempEventData';

const Home = () => {
    const categories = ["Music", "Family", "Food & Drink", "Outdoors", "Arts & Culture", "Spiritual", "Nightlife", "Workshops"];
    const [showFilters, setShowFilters] = useState(false); // setter function to toggle filter on mobile

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

                {/* Categories */}
                <div className="mb-8">
                    <h3 className="font-semibold mb-2">Categories</h3>
                    <ul className="space-y-2">
                        {categories.map((category, index) => (
                        <li key={index} className="text-left px-3 py-1.5 text-accent rounded-md hover:bg-accent/10 hover:text-accent cursor-pointer">
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
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent cursor-pointer" 
                                    />
                                <span className="text-gray-600 group-hover:text-accent transition-colors">
                                    {type}
                                </span>
                            </label>))}
                    </div>
                </div>
            </div>
        </aside>

        {/* Main Content */}
        <section className="grow py-3">
            {/* Path */}
            <h1 className="text-1xl mb-6">All Events/</h1>
            <div className="flex flex-col gap-4">
                {/* Product Cards */}
                <div className="p-10 text-center">
                    {tempEventData.map((event) => (<EventCard key={event.id} event={event} />))}
                </div>
            </div>
        </section>
        </div>
    );
};

export default Home;