import { useState, useEffect } from "react";

const AdminEvents = () => {

  // Template for new event form
  const emptyEvent = {
    name: "",
    description: "",
    price_base: 0.00,
    start_date: "",
    end_date: "",
    venue_id: null,
    category_id: null,
  };

  // Hooks for events, categories, venues, and loading state
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState(null);

  const openNewEventModal = () => {
    setNewEvent(emptyEvent);
  };
  const closeNewEventModal = () => {
    setNewEvent(null);
  };

  // Retrieve data from backend
  useEffect(() => {

    // Fetch events
    fetch("http://localhost:5000/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching events:", err));

    // Fetch categories
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch venues
    fetch("http://localhost:5000/api/venues")
      .then((res) => res.json())
      .then((data) => {
        setVenues(data);
      })
      .catch((err) => console.error("Error fetching venues:", err));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEvent),
      });
      if (res.ok) {
        const data = await res.json();
        // Update locally
        setEvents(events.map(ev => ev.id === editingEvent.id ? data.event : ev));
        setEditingEvent(null); // Set to null to close the modal
      }
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents([...events, data.event]); // Add new event to list
        closeNewEventModal(); // Close the modal
      }
    } catch (err) {
      console.error("Error when creating event:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      {/* Header: Title and New event button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button onClick={openNewEventModal} className="bg-accent text-white px-4 py-2 rounded-lg font-bold hover:bg-opacity-90">
          + New Event
        </button>
      </div>

    {/* Events Table */}
      <div className="overflow-x-auto border rounded-xl shadow-sm">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Event Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Location</th>
              <th className="p-4">Price</th>
              <th className="p-4">Start Date</th>
              <th className="p-4">End Date</th>
              <th className="p-4">Tickets Left</th>
              <th className="p-4 text-center">Edit/Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* Show loading state or map events */}
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center">Loading events...</td></tr>
            ) : (
              events.map((event) => (
                // If the name is too long, truncate; show the full name on hover
                // can never remember what comment syntax goes where, why do we need different ones for different languages
                <tr key={event.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium max-w-[200px] truncate" title={event.name}>{event.name}</td>
                  <td className="p-4 text-gray-600">{event.category}</td>
                  <td className="p-4 text-gray-600">{event.venue}</td>
                  <td className="p-4">£{event.price_base.toFixed(2)}</td>
                  <td className="p-4">{event.start_date}</td>
                  <td className="p-4">{event.end_date}</td>
                  <td className="p-4">{event.tickets_left}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => setEditingEvent(event)} className="text-accent hover:underline mr-4">Edit</button>
                    <button className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal using Short-Circuit Evaluation for conditional rendering */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit {editingEvent.name}</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              
              {/* Name Input */}
              <input 
                className="w-full border p-2 rounded"
                value={editingEvent.name}
                onChange={e => setEditingEvent({...editingEvent, name: e.target.value})}
              />

              {/* Venue Dropdown */}
              <select 
                className="w-full border p-2 rounded"
                value={editingEvent.venue_id}
                onChange={e => setEditingEvent({...editingEvent, venue_id: e.target.value})}
              >
                {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>

              {/* Category Dropdown */}
              <select 
                className="w-full border p-2 rounded"
                value={editingEvent.category_id}
                onChange={e => setEditingEvent({...editingEvent, category_id: e.target.value})}
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              {/* Price Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                Base Price (£) </label>
                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" type="number" step="0.01" placeholder="0.00" value={editingEvent.price_base} onChange={e => setEditingEvent({...editingEvent, price_base: e.target.value})} />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" type="date" value={editingEvent.start_date} onChange={e => setEditingEvent({...editingEvent, start_date: e.target.value})} />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                <input className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" type="date" value={editingEvent.end_date} onChange={e => setEditingEvent({...editingEvent, end_date: e.target.value})} />
              </div>

              {/* Buttons: Save, Cancel */}
              <div className="flex gap-2">
                <button type="submit" className="bg-accent text-white px-4 py-2 rounded">Save</button>
                <button type="button" onClick={() => setEditingEvent(null)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

        {/* New Event Modal */}
        {newEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full shadow-lg">
              <h2 className="text-xl font-bold mb-4">Create New Event</h2>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Event Name</label>
                  <input className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} required/>
                </div>

                                {/* Category Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                  <select className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" value={newEvent.category_id} onChange={e => setNewEvent({...newEvent, category_id: e.target.value})} required>
                    <option value="">Select a category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Venue Dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Venue</label>
                  <select className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" value={newEvent.venue_id} onChange={e => setNewEvent({...newEvent, venue_id: e.target.value})} required>
                    <option value="">Select a venue</option>
                    {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>

                {/* Price Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Base Price (£)</label>
                  <input className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" type="number"  min="0" step="0.01" placeholder="0.00" value={newEvent.price_base} onChange={e => setNewEvent({...newEvent, price_base: e.target.value})} required />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
                  <input className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" type="date" value={newEvent.start_date} onChange={e => setNewEvent({...newEvent, start_date: e.target.value})} required />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
                  <input className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" type="date" value={newEvent.end_date} onChange={e => setNewEvent({...newEvent, end_date: e.target.value})} required />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea className="w-full border p-2 rounded focus:ring-2 focus:ring-accent outline-none" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} required />
                </div>

                {/* Buttons: Create, Cancel */}
                <div className="flex gap-2">
                  <button type="submit" className="bg-accent text-white px-4 py-2 rounded">Create</button>
                  <button type="button" onClick={closeNewEventModal} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
                </div>

              </form>
            </div>
          </div>
        )}

    </div>
  );
};

export default AdminEvents;