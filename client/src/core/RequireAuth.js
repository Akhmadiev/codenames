import { useLocation, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const cookies = new Cookies();
  const userData = cookies.get('PlanningAuth');
  if (!userData) {
    return <Navigate to='/login' state={{ from: location }} />
  }

  return children;
}

export {RequireAuth};
