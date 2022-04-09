import React from 'react';
import { Layout } from "antd";
import { Select, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { useGlobalState, setGlobalState } from '../state';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Icon, { HomeOutlined } from '@ant-design/icons';
import _ from 'lodash';

const { Header } = Layout;
const { Option } = Select;

function NavBar() {
  let navigate = useNavigate();
  const [ signedIn ] = useGlobalState('signedIn');
  const [users, setUsers] = useState([]);
  
  let userId = localStorage.getItem('userId');

  useEffect(() => {
    async function fetchData() {
      const options = await getAllUsers();
      setUsers(filterUsers(options));
    }
    fetchData();
  }, []);

  const filterUsers = (users) => {
    return _.filter(users, (u) => u.id != userId);
  }

  const getAllUsers = async () => {
    const url = 'https://ewerulestheworld.tk/users'

    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      return [];
    }
  }
  
  const handleSelect = (e) => {
    navigate(`/people/?id=${e}`);
  }

  const signOut = () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const url = `https://ewerulestheworld.tk/sessions/${userId}`;

    const instance = axios.create({
      baseURL: url
    });
    
    instance.defaults.headers.common['Content-Type'] = 'application/json';

    axios
      .delete(url, {headers: {'X-API-TOKEN': token}})
      .then((response) => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setGlobalState('signedIn', false);

        navigate('/');
      })
      .catch((err) => {
        message.error('Ocurrió un error al cerrar sesión');
      });
  };
  return (
    <div>
      <Header className='flex gap-3 align-middle items-center justify-end'>
        {signedIn &&
          <div className='flex w-full justify-between align-middle items-center'>
            <div className='flex gap-5 items-center'>
              <a href='/'>
                <Icon component={HomeOutlined} style={{ color: 'white', fontSize: '32px' }}/>
              </a>
              <Select placeholder='Selecciona un usuario' size='large' onSelect={handleSelect}>
                {users.map((u) => (
                  <Option value={u.id} key={u.id}>
                    {u.name}
                  </Option>
                ))}
              </Select>
            </div>
            
            <div className='flex gap-3 items-center'>
              <Button type="default" size='large' href='/pings'>
                Mis Pings
              </Button>

              <Button type="primary" size='large' onClick={signOut}>
                Cerrar Sesión
              </Button>
            </div>
            
          </div>
          
        }

        {!signedIn &&
          <Button type="default" size='large' href='/login'>
            Inicia Sesión
          </Button>
        }

        {!signedIn &&
          <Button type="primary" size='large' href='/sign_up'>
            Regístrate
          </Button>
        }
      </Header>
    </div>
  );
} 

export default NavBar;