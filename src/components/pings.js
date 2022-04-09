import React from 'react';
import { Table } from 'antd';
import { useEffect } from 'react';
import { useState } from 'react'
import axios from "axios";
import NavBar from './navbar';
import { useGlobalState } from '../state';

function MyPings() {
  const [ signedIn ] = useGlobalState('signedIn');
  const [pings, setPings] = useState([]);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchData() {
      const res = await getPings();
      setPings(res);
    }
    fetchData();
  }, []);

  const getPings = async () => {
    const url = `https://ewerulestheworld.tk/pings/?recipient_id=${userId}`

    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      return [];
    }
  }
  

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a href={`/people/?id=${record.id}`}>
          {record.name}
        </a>
      ),
    },
    {
      title: 'Apodo',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Teléfono',
      dataIndex: 'phone',
      key: 'phone',
    },
  ];

  return (
    <div>
      <NavBar />
      {signedIn &&
      <div>
        <h1 className='text-center text-2xl my-5 text-blue-800'>
          Mis Pings
        </h1>

        <div className='flex mt-5 px-10 justify-center'>
          <Table dataSource={pings} columns={columns} />
        </div>
      </div>
      }
    </div>
  );
} 

export default MyPings;