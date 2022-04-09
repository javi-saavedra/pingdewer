import React from 'react';
import { Table, Input, message } from 'antd';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { useState } from 'react'
import * as L from "leaflet";
import _ from 'lodash';
import axios from "axios";

function MyMap() {
  const [positions, setPositions] = useState([]);
  const [position, setPosition] = useState(null);
  const [name, setName] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const url = `https://ewerulestheworld.tk/users/${userId}/locations`;
  
  useEffect(() => {
    async function fetchData() {
      const res = await getAllPositions();
      setPositions(formatList(res));
    }
    fetchData();
  }, [refreshKey]);

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
    try {
      const res = await axios.get(url, {headers: {'X-API-TOKEN': token}});
      return res.data;
    } catch (err) {
      return [];
    }
  }

  const addLocationQuery = () => {    
    const instance = axios.create({
      baseURL: url
    });
    
    instance.defaults.headers.common['Content-Type'] = 'application/json';

    const data = {
      name: name,
      lonlat: `POINT(${position.lng} ${position.lat})`
    }
    axios
      .post(url, data, {headers: {'X-API-TOKEN': token}})
      .then((response) => {
        message.success('Ubicación agregada correctamente');
        setRefreshKey(oldKey => oldKey +1)
      })
      .catch((err) => {
        message.error('Ocurrió al agregar la ubicación');
      });
  };

  // let map = L.map('map').setView([51.505, -0.09], 13);
  async function handleAddLocation() {
    await addLocationQuery();

    setPosition(null);
    setName(null);
  }

  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng)
        // map.flyTo(e.latlng, map.getZoom())
      },
    })

    const greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    return position === null ? null : (
      <Marker position={position} draggable icon={greenIcon}>
        <Popup>You are here</Popup>
      </Marker>
    )
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
      <h1 className='text-center text-2xl my-5 text-blue-800'>
        Mis ubicaciones
      </h1>
      <div className='px-10'>
        
        <MapContainer center={[-33.45, -70.64]} zoom={13} style={{"height": "360px"}}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
          {positions.map((pos) => (
            <Marker position={[pos.lat, pos.long]}>
              <Popup>
                {pos.name}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className='flex px-10 gap-3 mt-10'>
        <Input.Group>
          <Input
            style={{ width: 'calc(100% - 200px)' }}
            placeholder='Nombre ubicación'
            value={name}
            onChange={(v) => setName(v.target.value)}
            size="large"
          />
          <button 
            className='bg-green-500 px-4 py-2 text-white text-lg hover:text-white hover:bg-gray-900 disabled:opacity-75 disabled:hover:bg-green-500' 
            onClick={handleAddLocation}
            disabled={(_.isNil(position) || _.isNil(name)) ? true : false}
          >
            Agregar ubicación
        </button>
        </Input.Group>
      </div>

      <div className='flex mt-5 px-10 justify-center'>
        <Table dataSource={positions} columns={columns} />
      </div>
    </div>
  );
} 

export default MyMap;