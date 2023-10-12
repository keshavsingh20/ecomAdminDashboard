import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignUp from "./components/SignUp";
import PrivateComp from "./components/PrivateComp";
import Login from "./components/Login"
import AddProduct from "./pages/AddProduct"
import ProductList from "./pages/ProductList";
import UpdateProduct from "./pages/UpdateProduct";
import Profile from './pages/Profile';
import EditProfile from "./pages/EditProfile";
import EditPassword from "./pages/EditPassword";


function App() {
  return (
    <div className="App">
      {/* if We are applying any type of routing then we will keep that component in the BrowserRouter else we can keep outside or inside it's our choice.*/}

      <BrowserRouter>
        <Navbar />
        <Routes>

          <Route element={<PrivateComp />} >
            <Route path="/" element={<ProductList />}></Route>
            <Route path="/add" element={<AddProduct />}></Route>
            <Route path="/update/:id" element={<UpdateProduct />}></Route>
            <Route path="/logout" element={<h1>Logout Component</h1>}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/edit/profile/:id" element={<EditProfile />}></Route>
            <Route path="/edit/password/:id" element={<EditPassword />}></Route>
          </Route>

          <Route path="/register" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
