import { useMutation } from 'react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IRoom, IUser } from '../models/IRoom';
import '../css/RoomPreparation.css';
import { QueryService } from '../services/QueryService';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';

const RoomPreparation = () => {
    const { id } = useParams();
    const { isLoading, data: response } = useQuery('preparation-words', () => QueryService.getWords(id as string));
    const navigate = useNavigate();
    const location = useLocation();
    const cookies = new Cookies();
    const userData = cookies.get('PlanningAuth') as IUser;
    const fromPage = location.state?.from?.pathname || '/';
    const { mutate } = useMutation(async (data: [boolean, boolean]) => {
        const isReadTeam = data[0];
        const isCaptain = data[1];
        return await QueryService.selectTeam(id as string, userData, isReadTeam, isCaptain);
    }, {
        onSuccess: (response: any) => {
            navigate(`/${id}`);
        }
    });

    if (isLoading) {
        return <div className='container'><div className='loading'></div></div>
    }
    const roomData = response?.data as IRoom;
    const redCaptain = roomData.players.filter(x => x.isCaptain && x.isRedTeam)[0];
    const blueCaptain = roomData.players.filter(x => x.isCaptain && !x.isRedTeam)[0];
    const redPlayers = roomData.players.filter(x => !x.isCaptain && x.isRedTeam).map(x => x.user.name);
    const bluePlayers = roomData.players.filter(x => !x.isCaptain && !x.isRedTeam).map(x => x.user.name);
    return (
        <div>
            <div className="preparation-block preparation-block-red">
                <label className='preparation-captain'>Captain: <i><b>{redCaptain?.user?.name}</b></i></label>
                <div className="input-group-append">
                    <button
                        disabled={redCaptain != null}
                        onClick={() => mutate([true, true])}
                        className="btn btn-outline-secondary"
                        type="button">
                        Select
                    </button>
                </div>
                <label>Players:</label>
                {redPlayers.map(player => (<label className='preparation-player'>{player}</label>))}
                <div className="input-group-append">
                    <button
                        onClick={() => mutate([true, false])}
                        className="btn btn-outline-secondary"
                        type="button">
                        Select
                    </button>
                </div>
            </div>
            <div className="preparation-block preparation-block-blue">
                <label className='preparation-captain'>Captain: <i><b>{blueCaptain?.user?.name}</b></i></label>
                <div className="input-group-append">
                    <button
                        disabled={blueCaptain != null}
                        onClick={() => mutate([false, true])}
                        className="btn btn-outline-secondary"
                        type="button">
                        Select
                    </button>
                </div>
                <label>Players:</label>
                {bluePlayers.map(player => (<label className='preparation-player'>{player}</label>))}
                <div className="input-group-append">
                    <button
                        onClick={() => mutate([false, false])}
                        className="btn btn-outline-secondary"
                        type="button">
                        Select
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoomPreparation;
