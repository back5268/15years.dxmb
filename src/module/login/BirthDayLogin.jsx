import React, {useEffect, useState} from 'react';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import logo15Nam from '../../assets/dxmb-15nam.png';
import slogan from '../../assets/slogan.png';
import {loginApi} from "../../api/utils";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export default function BirthdayLogin() {
    const [infos, setInfos] = useState({employeeName: '', employeeCode: ''});
    const handleLogin = async () => {
        if (!infos.employeeCode) return toast.error('Vui lòng nhập mã nhân viên!')
        if (!infos.employeeName) return toast.error('Vui lòng nhập tên nhân viên!')
        const info = {...infos}
        const response = await loginApi({...info})
        if (response.status) {
            if (response?.data?.wheel) {
                localStorage.setItem('birthday-dxmb', response.data.employeeCode)
                window.location.href = '/wheel'
            } else {
                toast.success(response.mess || 'Tham dự thành công! Vui lòng chờ chương trình bắt đầu nha!')
            }
        } else {
            toast.success(response.mess || 'Bạn đã tham gia trước đó rồi! Vui lòng chờ chương trình bắt đầu nha!')
        }
    }
    useEffect(() => {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();
        window.addEventListener('resize', setVH);
        return () => window.removeEventListener('resize', setVH);
    }, []);
    return (
        <div className="login-container grid ">
            {/* Side trái: Thông tin sự kiện (rút gọn) */}
            <div className="col-12 md:col-8 hidden md:flex align-items-center justify-content-center birthday-side">
                <div className="content text-center flex flex-column align-items-center justify-content-center px-6">
                    <p className="event-title mt-2 mb-5">Lễ kỷ niệm</p>
                    <img src={logo15Nam} alt="15 nam" className="logo15"/>
                    <div className="date-banner" >
                        <span className="date">07.07.2010</span>
                        <span className="dot"/>
                        <span className="date">07.07.2025</span>
                    </div>
                    <img src={slogan} alt="Slogan" className="slogan mb-4"/>
                </div>
            </div>
            <div
                className="col-12 md:col-4 flex align-items-center flex-column justify-content-center login-side text-center">
                <div className="image-mobile">
                    <img src={logo15Nam} alt="15 nam" className="logo15"/>
                    <img src={slogan} alt="Slogan" className="slogan mb-4"/>
                </div>
                <h2
                    className="text-white font-bold title-form"
                >
                    Đăng nhập tham dự
                </h2>
                <div className="p-4 text-center form-register" style={{}}>
                    <div className="p-fluid flex flex-column text-start" style={{ gap: '1.2vh'}}>
                        <span className="p-input-icon-left">
                            <i className="pi pi-user"/>
                            <InputText placeholder="Mã nhân viên" value={infos.employeeCode}
                                       onChange={(e) => setInfos({...infos, employeeCode: e.target.value})}
                                       className="custom-input"/>
                        </span>
                        <span className="p-input-icon-left">
                            <i className="pi pi-lock"/>
                            <InputText value={infos.employeeName}
                                       onChange={(e) => setInfos({...infos, employeeName: e.target.value})}
                                       placeholder="Tên nhân viên" className="custom-input"/>
                        </span>
                        <Button
                            label="Tham dự ngay 🎊"
                            icon="pi pi-birthday-cake"
                            className="fancy-button mt-3"
                            onClick={handleLogin}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
