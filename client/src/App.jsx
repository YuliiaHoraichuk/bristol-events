import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventPage from './components/EventPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UserPage from './pages/UserPage';
import AdminPage from './pages/AdminPage';
import AdminEvents from './pages/AdminEvents';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import TicketReceipt from './pages/PrintTicketPage';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  }); // null if not logged in, otherwise user det

  return (
    <Router>
      <Layout user={user} setUser={setUser}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventPage user={user} />} />
          <Route path="/signup" element={<SignUp setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/user/:username" element={<UserPage user={user} />} />
          <Route path="/ticket/:orderId" element={<TicketReceipt />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

