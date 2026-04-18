import { useParams } from 'react-router-dom';
import { tempEventData } from '../temp_data/TempEventData';

const EventPage = () => {
    const { id } = useParams();
    const event = tempEventData.find((e) => e.id === parseInt(id));
    if (!event) return <div className="p-10 text-center">404 Page not found</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 pt-10 pb-20">
            {/* Title + Category */}
            <header className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-accent font-bold text-sm uppercase tracking-widest">{event.category}
                    </span>
                    <span className="text-gray-500 text-sm">{event.location}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">{event.title}
                </h1>
            </header>
            {/* Image Section */}
            <div className="w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-sm border border-gray-100">
                <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Description: 2 column desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                {/* Info: date, time, buy ticket*/}
                <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
                    <div className="p-8 border border-gray-100 rounded-3xl bg-gray-50/50 backdrop-blur-sm">
                        <div className="text-2xl font-bold text-gray-900 mb-4">{event.price}</div>
            
                        <button className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-accent/90 transition-all mb-6">Get Tickets</button>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Date</span>
                                <span className="font-semibold text-gray-900">{event.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Time</span>
                                <span className="font-semibold text-gray-900">{event.time}</span>
                            </div>
                        </div>
                    </div>
                </aside>
                {/* Main description, nore info*/}
                <main className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4">About the Event</h2>
                    <div className="text-gray-600 space-y-4 leading-relaxed">
                        <p>{event.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EventPage;