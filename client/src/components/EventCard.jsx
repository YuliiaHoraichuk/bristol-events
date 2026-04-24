import { Link } from 'react-router-dom';    

const EventCard = ({ event }) => {
    return (
        <Link to={`/event/${event.id}`}>
            <div className="flex flex-col sm:flex-row my-3 bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                {/* Image. If path broken, apply graceful degradation: placeholder+alt */}
                <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-gray-100">
                    <img 
                        src={event.img_filename ? `http://localhost:5000/static/uploads/${event.img_filename}` : 'https://via.placeholder.com/400x300?text=No+Image'} 
                        alt={event.name} 
                        className="w-full h-full object-cover" 
                    />
                </div>

                <div className="p-5 flex flex-col justify-between grow">
                    <div>
                        <div className="flex justify-between items-start text-sm mb-1">
                            <span className="text-accent font-bold uppercase tracking-wide">
                                {event.start_date}
                            </span>
                            <span className="font-bold text-gray-900">
                                £{event.price_base.toFixed(2)}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent transition-colors">
                            {event.name}
                        </h3>
                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{event.description}</p>
                    </div>
                    <div className="mt-4 flex items-center text-gray-400 text-xs uppercase tracking-widest font-semibold">
                        {event.venue} • {event.category}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;