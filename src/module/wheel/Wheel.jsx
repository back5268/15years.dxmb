import React, {useState, useEffect, useRef} from 'react';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';
import {Dialog} from 'primereact/dialog';
import Confetti from 'react-confetti';
import {toast} from "react-toastify";

import logo15Nam from '../../assets/dxmb-15nam.png';
import slogan from '../../assets/slogan.png';
import {useFetch} from "../../api/hookApi/apiCall";
import {getPrizeApi, spinApi} from "../../api/utils";

const AnimatedNumberWheel = ({value, index, spinning, finalChar}) => {
    const [currentChar, setCurrentChar] = useState(value);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (index < 2) return; // M, B cố định

        clearInterval(intervalRef.current);

        if (spinning) {
            const spinSpeed = 50 + index * 15;
            intervalRef.current = setInterval(() => {
                const randomChar = Math.floor(Math.random() * 10).toString();
                setCurrentChar(randomChar);
            }, spinSpeed);
        } else if (finalChar != null) {
            // 🛑 STOP ngay khi spinning kết thúc và có kết quả
            setCurrentChar(finalChar);
        }

        return () => clearInterval(intervalRef.current);
    }, [spinning, finalChar, index]);

    return (
        <div className="flex align-items-center justify-content-center mx-1 number-box"
             style={{
                 ...styles.box,
                 transform: spinning && index >= 2 ? 'scale(1.05)' : 'scale(1)',
                 transition: 'transform 0.1s ease',
                 // 🎯 Thêm border khác khi đang quay
                 borderColor: spinning && index >= 2 ? '#ff6b6b' : '#ff4081'
             }}>
            {index < 2 ? value : currentChar}
        </div>
    );
};

const styles = {
    box: {
        position: 'relative',
        width: '15vh',
        height: '15vh',
        fontSize: '8vh',
        background: 'radial-gradient(circle, #fff8e1 0%, #ffe0b2 100%)',
        color: 'red',
        fontWeight: 'bold',
        borderRadius: '1rem',
        border: '4px dashed #ff4081',
        boxShadow: `
            0 0 0 4px #ffffff,
            0 0 15px 4px rgba(255, 105, 180, 0.6),
            inset 0 0 10px rgba(255, 204, 128, 0.5)
        `,
        textShadow: '1px 1px 4px rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    }
};

const Wheel = () => {
    const [displayCode, setDisplayCode] = useState(['M', 'B', '0', '0', '0', '0', '0']);
    const [params, setParams] = useState({render: false});
    const [infos, setInfos] = useState({});
    const [round, setRound] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [winner, setWinner] = useState(null);
    const {data: listPrizes} = useFetch(getPrizeApi, params, [JSON.stringify(params)]);
    useEffect(() => {
        if (listPrizes && listPrizes?.[0] && infos.prize) {
            const findPrize = listPrizes.find(l => l.code === infos.prize);
            if (findPrize) {
                setRound(Number(findPrize.quantity) - Number(findPrize.awarded));
            }
        }
    }, [JSON.stringify(listPrizes)]);
    const spin = async () => {
        if (spinning) return;
        try {
            if (!infos.prize) return toast.error('Chọn giải thưởng trước khi quay');
            const result = await spinApi({prizeCode: infos.prize})
            if (!result.status) {
                toast.error(result.mess || 'Quay thất bại!');
                setSpinning(false);
                return;
            }
            const winnerData = result.data;
            // 🚨 KHÔNG SET winner ngay! Chỉ lưu tạm
            let tempWinner = winnerData;
            setSpinning(true);
            setShowResult(false);
            setWinner(null);
            setTimeout(() => {
                setDisplayCode(tempWinner.employeeCode.split(''));
                setTimeout(() => {
                    setSpinning(false);
                    setWinner(tempWinner);
                    setShowResult(true);
                    setParams((prev) => ({...prev, render: !prev.render}));
                }, 2000);
            }, 5000);
        } catch (err) {
            console.log('Lỗi khi quay số:', err);
            setSpinning(false);
        }
    };
    return (
        <div className="wheel-background grid">
            <div className="md:col-5">
                <img
                    src={logo15Nam}
                    alt="logo 15 năm"
                    style={{
                        position: 'absolute',
                        top: '2%',
                        left: '0.5%',
                        width: '30%',
                        opacity: .8,
                        zIndex: 0
                    }}
                />
                <img
                    src={slogan}
                    alt="slogan"
                    style={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '0.5%',
                        width: '50%',
                        opacity: 0.9,
                        zIndex: 0
                    }}
                />
            </div>
            <div className="md:col-7" style={{marginTop: '20vh'}}>
                <div className="grid">
                    <div className="md:col-10 flex align-items-end justify-content-end gap-1">
                        {displayCode.map((char, idx) => (
                            <AnimatedNumberWheel
                                key={idx}
                                value={char}
                                index={idx}
                                spinning={spinning}
                                finalChar={winner ? winner.employeeCode[idx] : null}
                            />
                        ))}
                    </div>
                    <div className="md:col-2 flex align-items-center justify-content-center">
                        <Button
                            label="START"
                            onClick={spin}
                            disabled={spinning}
                            className="fancy-spin-button"
                        />
                    </div>
                </div>
                <div className="flex justify-content-center"
                     style={{gap: '1vw', marginTop: '3vh', height: '9vh', alignItems: 'center'}}>
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
                            padding: '1.5vh 1.5vw',
                            borderRadius: '50%',
                            fontSize: '2.2vw',
                            textAlign: 'center',
                            fontWeight: "bold",
                            fontFamily: 'sans-serif',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'transform 0.3s',
                        }}
                    >
                        {round}
                    </div>
                    <Dropdown
                        value={infos.prize}
                        options={listPrizes}
                        onChange={(e) => {
                            if (e.target.value) {
                                const findCount = listPrizes.find(l => l.code === e.target.value)
                                setRound(Number(findCount.quantity) - Number(findCount.awarded))
                            }
                            setInfos({prize: e.target.value})
                        }}
                        optionLabel="name"
                        optionValue="code"
                        placeholder="Chọn giải thưởng"
                        disabled={spinning}
                        className="birthday-dropdown"
                    />
                </div>
            </div>
            <Dialog
                header="🎊 KẾT QUẢ QUAY SỐ 🎊"
                visible={showResult}
                onHide={() => setShowResult(false)}
                closable={false}
                draggable={false}
                dismissableMask
                className="spin-result-dialog"
            >
                {winner && (
                    <div className="text-center" style={{
                        padding: '1vw',
                        fontSize: '1.5vw',
                        lineHeight: '2',
                        background: 'linear-gradient(to bottom, #fff8e1, #ffecb3)'
                    }}>
                        <strong style={{color: '#c62828'}}>{winner.employeeName}</strong><br/>
                        <span style={{color: '#37474f'}}>Mã số: <strong>{winner.employeeCode}</strong></span><br/>
                        Đã trúng: <strong style={{color: '#ff8f00'}}>Giải {winner.prize.type}</strong>
                    </div>
                )}
            </Dialog>
            {winner && showResult && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={350}
                    gravity={0.8}
                    wind={0.01}
                    initialVelocityY={20}
                    colors={['#ffe082', '#ffd740', '#ffab40', '#ff80ab', '#ffffff']}
                    recycle={false}
                    tweenDuration={10000}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        zIndex: 9999,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </div>
    );
};

export default Wheel;
