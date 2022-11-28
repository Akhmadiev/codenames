import React from 'react';
import './App.css';
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewRoom from './components/NewRoom';
import Room from './components/Room';
import NewUser from './components/NewUser';
import RoomPreparation from './components/RoomPreparation';
import { RequireAuth } from './core/RequireAuth';
import { useState } from 'react';
import * as io from 'socket.io-client';
import SocketContext from './core/SocketContext';
import DataContext from './core/DataContext';
import { IRoom } from './models/IRoom';
import Rooms from './components/Rooms';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: 1000 * 10,
        cacheTime: 0
      }
    }
  });
  
  const [data, setData] = useState({} as IRoom);
  const [socket, setSocket] = useState(io.connect(process.env.REACT_APP_SERVER || "http://localhost:4001"));

  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <DataContext.Provider value={{ data, setData }}>
          <SocketContext.Provider value={{ socket, setSocket }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<RequireAuth><Rooms /></RequireAuth>} />
                {/* <Route path="/" element={<RequireAuth><Rooms /></RequireAuth>} /> */}
                {/* <Route path="/delete" element={<RequireAuth><Rooms /></RequireAuth>} /> */}
                <Route path="/newRoom" element={<RequireAuth><NewRoom /></RequireAuth>} />
                <Route path="/rooms" element={<RequireAuth><Rooms /></RequireAuth>} />
                <Route path=":id" element={<RequireAuth><Room /></RequireAuth>} />
                <Route path=":id/preparation" element={<RequireAuth><RoomPreparation /></RequireAuth>} />
                <Route path="login" element={<NewUser />} />
              </Routes>
            </BrowserRouter>
          </SocketContext.Provider>
        </DataContext.Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
