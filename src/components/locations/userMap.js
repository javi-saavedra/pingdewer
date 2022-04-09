import React from 'react';
import { message } from 'antd';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useState } from 'react'
import * as L from "leaflet";
import axios from "axios";
import NavBar from '../navbar';
import { useGlobalState } from '../../state';

function UserMap() {
  const [positions, setPositions] = useState([]);
  const [otherPositions, setOtherPositions] = useState([]);
  const [information, setInformation] = useState(null);
  const [ signedIn ] = useGlobalState('signedIn');

  const urlParams = new URLSearchParams(window.location.search);
  const otherUserId = urlParams.get('id');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


  useEffect(() => {
    async function fetchData() {
      const [resPositions, resOtherPositions] = await getAllPositions();
      const resInformation = await getUserInformation();

      setPositions(formatList(resPositions));
      setOtherPositions(formatList(resOtherPositions));

      setInformation(resInformation);
    }
    fetchData();
  }, []);

  const formatList = (positions) => {
    return positions.map((p) => {
      let string_aux = p['st_astext'].replace('POINT(', '');
      string_aux = string_aux.replace(')', '');

      let positionList = string_aux.split(' ');
      return {
        ...p, 
        long: positionList[0],
        lat: positionList[1]
      }
    });
  }

  const getAllPositions = async () => {
    const url_1 = `https://ewerulestheworld.tk/users/${userId}/locations`;
    const url_2 = `https://ewerulestheworld.tk/users/${otherUserId}/locations`;

    try {
      const res_1 = await axios.get(url_1, {headers: {'X-API-TOKEN': token}});
      const res_2 = await axios.get(url_2, {headers: {'X-API-TOKEN': token}});

      // Array.prototype.push.apply(res_1.data, res_2.data);
      return [res_1.data, res_2.data];
    } catch (err) {
      return [];
    }
  }

  const getUserInformation = async () => {
    const url = `https://ewerulestheworld.tk/users/${otherUserId}`;
    
    try {
      const res = await axios.get(url, {headers: {'X-API-TOKEN': token}});
      return res.data;
    } catch (err) {
      return [];
    }
  }

  const handlePing = () => {
    let url = "https://ewerulestheworld.tk/pings";

    const instance = axios.create({
      baseURL: url
    });
    
    instance.defaults.headers.common['Content-Type'] = 'application/json'

    let data = {
      sender_id: userId,
      recipient_id: otherUserId
    }

    axios
      .post(url, data)
      .then((response) => {
        message.success('Ping enviado correctamente')
      })
      .catch((err) => {
        
        message.error('Ocurrió un error al hacer Ping');
      });
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Longitud',
      dataIndex: 'long',
      key: 'long',
    },
    {
      title: 'Latitud',
      dataIndex: 'lat',
      key: 'lat',
    },
  ];

  return (
    <div>
      <NavBar/>
      {signedIn &&
      <div>
        <div className='my-5'>
          <h1 className='text-center text-2xl mb-2 text-blue-800'>
            Ubicaciones de {information?.name}
          </h1>

          <div className='text-center text-gray-500 divide-x'>
            <span className='px-3'>
              {information?.nickname}
            </span>
            <span className='px-3'>
              +56{information?.phone}
            </span>
            <span className='px-3'>
              {information?.email}
            </span>
          </div>
        </div>
        <div className='px-10'>
          
          <MapContainer center={[-33.45, -70.64]} zoom={13} style={{"height": "360px"}}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {positions.map((pos) => (
              <Marker position={[pos.lat, pos.long]}>
                <Popup>
                  {pos.name}
                </Popup>
              </Marker>
            ))}
            {otherPositions.map((pos) => (
              <Marker position={[pos.lat, pos.long]} icon={redIcon}>
                <Popup>
                  {pos.name}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className='flex justify-center mt-5'>
          <button 
              className='bg-green-500 px-4 py-2 text-white text-lg hover:text-white hover:bg-gray-900 disabled:opacity-75 disabled:hover:bg-green-500' 
              onClick={handlePing}
            >
              Ping
          </button>
        </div>
      </div>
      }
    </div>
  );
} 

export default UserMap;