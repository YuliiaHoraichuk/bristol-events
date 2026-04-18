import { Link } from "react-router-dom";

const AdminPage = () => {
    // DUMMY NUM; Substitute with real data from backend
    const adminOptions = [
        { name: 'Manage Events', path: '/admin/events', num: 2},
        { name: 'Manage Orders', path: '/admin/orders', num: 5 },
        { name: 'Manage Users', path: '/admin/users', num: 10 },
    ];

    return (
        <div className="max-w-6xl mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminOptions.map((item) => (
                    <Link 
                      key={item.name} 
                      to={item.path}
                      className="p-6 border rounded-2xl hover:border-accent hover:shadow-md transition-all">
                        <h2 className="text-xl font-bold">{item.name}</h2>
                        <p className="text-gray-500 text-sm">{item.num} items</p>
          </Link>
        ))}
      </div>
        </div>
    )
};

export default AdminPage;