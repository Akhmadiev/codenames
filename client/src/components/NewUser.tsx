import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 } from 'uuid';
import { IUser } from '../models/IRoom';

const NewUser = () => {
    const [playerName, setPlayeName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/';

    const onChange = (evt: any) => {
        var value = evt.target.value;
        setPlayeName(value);
    }

    const onCreateUser = () => {
        const cookies = new Cookies();
        const player = {
            id: v4(),
            name: playerName
        } as IUser;

        cookies.set('PlanningAuth', player, { path: '/' });
        navigate(fromPage, { replace: true });
    }

    return (
        <div>
            <div className="input-group mb-3 new-room">
                <input
                    onChange={(evt) => onChange(evt)}
                    type="text"
                    className="form-control"
                    placeholder="Login"
                    aria-label="Login"
                    aria-describedby="basic-addon2" />
                <div className="input-group-append">
                    <button
                        onClick={() => onCreateUser()}
                        className="btn btn-outline-secondary"
                        type="button"
                        style={{ backgroundColor: "#90EE90" }}>
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewUser;
