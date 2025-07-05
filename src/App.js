import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.min.css';
import BirthdayLogin from "./module/login/BirthDayLogin";
import './style/birthday.css'
import './style/wheel.css'
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Wheel from "./module/wheel/Wheel";
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";

function App() {
    const isAuthenticated = !!localStorage.getItem('birthday-dxmb');
    return (
        <>
            <ToastContainer
                newestOnTop={true}
                autoClose={1500} position="top-center"
                theme="light"
                toastStyle={{
                    background: 'linear-gradient(to right, #fff1eb, #ffdde1)', // hồng kem pastel
                    color: '#880e4f', // tím mận ngọt ngào
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: '2px dashed #ff80ab',
                    boxShadow: '0 0 10px #ff80ab',
                    borderRadius: '12px',
                    padding: '14px 20px',
                    textShadow: '1px 1px #fff',
                }}
            />
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? <Navigate to="/wheel" replace /> : <BirthdayLogin />
                        }
                    />
                    <Route
                        path="/wheel"
                        element={
                            isAuthenticated ? <Wheel /> : <Navigate to="/" replace />
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}


export default App;
