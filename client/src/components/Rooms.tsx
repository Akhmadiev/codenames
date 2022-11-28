import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { QueryService } from "../services/QueryService";
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Room.css'
import { IRoom } from '../models/IRoom';
import NewRoom from './NewRoom';
import '../css/Rooms.css';
import { Link } from 'react-router-dom';

function Rooms() {
    const [data, setData] = useState({});
    const roomQuery = useQuery('words', () => QueryService.getRooms(), {
        onSuccess(response) {
            setData(response.data);
        }
    });

    if (roomQuery.isLoading) {
        return <div className='container'><div className='loading'></div></div>
    }

    const roomData = data as IRoom[];

    return (
        <React.StrictMode>
            <NewRoom />
            <div className='rooms'>
                {roomData.map(room => <div key={room.id}>{new Date(room.createDate).toLocaleDateString()} { ' - ' } <Link to={`/${room.id}`}>{room.name}</Link></div>)}
            </div>
        </React.StrictMode>);
}

export default Rooms;