import { Link, Route, Routes } from 'react-router-dom';

import Login from './pages/Login'
import Signup from './pages/Signup'
import DashBoard from './pages/DashBoard'
function App() {
    return (
        <>
        <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/dashboard" element={<DashBoard />} />
        </Routes>
</>
    );

}
export default App