import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tours from './pages/Tours';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminTour from './pages/admin/Tour';
import AdminTourItinerary from './pages/admin/TourItinerary';
import Profile from './pages/user/Profile';
import Favorite from './pages/user/Favorite';
import BookingHistory from './pages/user/BookingHistory';
import './assets/css/index.css';

function App() {
     return (
          <BrowserRouter>
               <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route element={<Layout />}>
                         <Route path="/" element={<Home />} />
                         <Route path="/tours" element={<Tours />} />

                         {/* Admin */}
                         <Route path="/admin" element={<AdminDashboard />} />
                         <Route path="/admin/tours" element={<AdminTour />} />
                         <Route path="/admin/tour-itinerary" element={<AdminTourItinerary />} />

                         {/* User */}
                         <Route path="/user/profile" element={<Profile />} />
                         <Route path="/user/favorite" element={<Favorite />} />
                         <Route path="/user/bookings" element={<BookingHistory />} />
                    </Route>
               </Routes>
          </BrowserRouter>
     );
}

export default App;
