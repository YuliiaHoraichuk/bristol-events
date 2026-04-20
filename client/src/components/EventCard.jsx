import { Link } from 'react-router-dom';    

const EventCard = ({ event }) => {
    return (
        <Link to={`/event/${event.id}`}>
            <div className="flex flex-col sm:flex-row my-3 bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
              {/* Image */}
              <div className="w-full sm:w-48 h-48 sm:h-auto shrink-0">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              </div>

          {/* Details */}
            <div className="p-5 flex flex-col justify-between grow">
              <div>
                <div className="flex justify-between items-start text-sm mb-1">
                  <span className="text-accent font-bold uppercase tracking-wide">
                    {event.date} • {event.time}
                  </span>
                  <span className="font-bold text-gray-900">{event.price}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent    transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{event.description}</p>
              </div>

              <div className="mt-4 flex items-center text-gray-400 text-xs">
                {event.location}
              </div>
            </div>
        </div>
    </Link>
  );
};

export default EventCard;