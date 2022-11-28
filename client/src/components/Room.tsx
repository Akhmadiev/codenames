import React, { useContext, useRef } from 'react';
import { useQuery } from 'react-query';
import { QueryService } from "../services/QueryService";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { IWord, Significance } from "../models/IWord";
import '../css/Room.css'
import { useMutation } from 'react-query';
import { IRoom, IUser } from '../models/IRoom';
import Cookies from 'universal-cookie';
import { useLocation, Navigate } from 'react-router-dom';
import DataContext from '../core/DataContext';
import SocketContext from '../core/SocketContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLongPress } from 'use-long-press';
import { TIMEOUT } from 'dns';

function getWordBackgroundColor(isCaptain: boolean, word: IWord) {
    const black = 'rgb(58, 57, 57)';
    const blue = 'rgb(68, 153, 250)';
    const red = 'rgb(255, 126, 126)';
    const white = 'white';

    if (isCaptain || word.checked) {
        if (word.significance === Significance.Black) {
            return black;
        } else if (word.significance === Significance.Blue) {
            return blue;
        } else if (word.significance === Significance.Red) {
            return red;
        }
    }

    return white;
}

function longPress() {
    
}

function Room() {
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);
    const { data, setData } = useContext(DataContext);
    const [redPlayersVisible, setRedPlayersVisible] = useState(false);
    const [bluePlayersVisible, setBluePlayersVisible] = useState(false);
    const location = useLocation();
    const cookies = new Cookies();
    const userData = cookies.get('PlanningAuth') as IUser;
    const { id } = useParams();
    socket.emit("join_room", { roomId: id, user: userData });
    const isLongPress = useRef(false);
    const timerRef = useRef(setTimeout(() => { }));
    const roomQuery = useQuery('words', () => QueryService.getWords(id as string), {
        onSuccess: (response) => {
            setData(response.data);
        }
    });
    const wordCheck = useMutation(async (wordId: number) => { return await QueryService.wordCheck(id as string, wordId); }, {
        onSuccess: (response) => {
            setData(response.data);
            socket.emit('refetch', data.id);
        }
    });
    
    function startPressTimer(word: IWord) {
        isLongPress.current = false;
        timerRef.current = setTimeout(() => {
            isLongPress.current = true;
            console.log('longpress');
            wordCheck.mutate(word.id)
        }, 2000)
    };

    function handleOnMouseDown(word: IWord) {
        startPressTimer(word);
    }

    function handleOnTouchStart(word: IWord) {
        startPressTimer(word);
    }

    function handleOnMouseUp() {
        clearTimeout(timerRef.current);
    }

    function handleOnTouchEnd() {
        clearTimeout(timerRef.current);
    }

    useEffect(() => {
        socket.on("refetch", () => {
            roomQuery.refetch();
        });
        // eslint-disable-next-line
    }, [socket]);
    
    const roomData = data as IRoom;

    if (roomQuery.isLoading || roomData?.players == null) {
        return <div className='container'><div className='loading'></div></div>
    }
    if (!roomData.players.map(x => x.user.id).includes(userData.id)) {
        return <Navigate to='preparation' />
    }

    const currentPlayer = roomData.players.filter(x => x.user.id === userData.id)[0];
    const isCaptain = currentPlayer?.isCaptain;
    const words = roomData.words;
    const redWordsLeft = words.filter(x => !x.checked && x.significance === Significance.Red).length;
    const blueWordsLeft = words.filter(x => !x.checked && x.significance === Significance.Blue).length;
    const redCaptainName = roomData.players.filter(x => x.isCaptain && x.isRedTeam)[0]?.user?.name;
    const blueCaptainName = roomData.players.filter(x => x.isCaptain && !x.isRedTeam)[0]?.user?.name;
    const redPlayers = roomData.players.filter(x => !x.isCaptain && x.isRedTeam).map(x => x.user);
    const bluePlayers = roomData.players.filter(x => !x.isCaptain && !x.isRedTeam).map(x => x.user);



    return (
        <React.StrictMode>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div
                className='room'
            >
                <div className='word-block'
                    style={{
                        opacity: roomData.finished ? '0.4' : '',
                        pointerEvents: roomData.finished ? 'none' : 'all',
                    }}>
                    {words.map(word => (
                        <button
                            key={word.id}
                            disabled={word.checked || isCaptain}
                            className='word svg'
                            onTouchStart={() => handleOnTouchStart(word)}
                            onTouchEnd={handleOnTouchEnd}
                            onMouseDown={() => handleOnMouseDown(word)}
                            onMouseUp={handleOnMouseUp}
                            style={{
                                backgroundColor: getWordBackgroundColor(isCaptain, word),
                                color: (isCaptain || word.checked) && word.significance === Significance.Black ? 'white' : '',
                                pointerEvents: word.checked || isCaptain ? 'none' : 'all',
                                opacity: word.checked ? '0.4' : ''
                            }}>{word.word}</button>))}
                </div>
                <div className="room-players">
                    <div className="room-players-content" style={{ visibility: redPlayersVisible || bluePlayersVisible ? 'visible' : 'hidden', backgroundColor: redPlayersVisible ? 'rgb(255, 126, 126)' : 'rgb(68, 153, 250)' }}>
                        {<p>{redPlayersVisible ? redCaptainName : blueCaptainName}</p>}
                        {redPlayersVisible ? redPlayers.map(x => (<p key={x.id} className='room-red-player-content'>{x.name}</p>)) : bluePlayers.map(x => (<p key={x.id} className='room-red-player-content'>{x.name}</p>))}
                    </div>
                    <label className='room-red-words-left'>{redWordsLeft}</label>
                    <button className="btn btn-outline-secondary room-red-players-btn" onClick={function () { setRedPlayersVisible(!redPlayersVisible); setBluePlayersVisible(false); }}>Показать игроков</button>
                    <label className='room-blue-words-left'>{blueWordsLeft}</label>
                    <button className="btn btn-outline-secondary room-blue-players-btn" onClick={function () { setRedPlayersVisible(false); setBluePlayersVisible(!bluePlayersVisible); }}>Показать игроков</button>
                </div>
                <div className='home-block'>
                    <button className="btn btn-outline-secondary fa fa-home home-btn" onClick={function () { navigate(`/rooms`); }}></button>
                </div>
                <h3 className="animate-charcter animate-charcter-blue" style={{visibility: roomData.finished && !roomData.redWins ? 'visible': 'hidden' }}>Булат петух</h3>
                <h3 className="animate-charcter animate-charcter-red" style={{visibility: roomData.finished && roomData.redWins ? 'visible': 'hidden'}}>Булат петух</h3>
            </div>
        </React.StrictMode>);
}

export default Room;