import React from 'react';
import { Form, Input, Button, message } from 'antd';
import NavBar from './navbar';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setGlobalState } from '../state';

function LogIn() {
  let navigate = useNavigate();

  const onFinish = (values) => {    
    let url = "https://ewerulestheworld.tk/sessions";

    const instance = axios.create({
      baseURL: url
    });
    
    instance.defaults.headers.common['Content-Type'] = 'application/json'

    axios
      .post(url, values)
      .then((response) => {
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('email', response.data.email);
        setGlobalState('signedIn', true);

        navigate('/');
      })
      .catch((err) => {
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setGlobalState('signedIn', false);
        message.error('Ocurrió un error al iniciar sesión. Comprueba que tus credenciales estén correctas');
      });
  };

  return (
    <div>
      <NavBar/>
      <div className='rounded-lg border border-gray-100 py-7 px-4 mx-20 my-10 shadow'>
        <h1 className='text-2xl text-blue-600 text-center mb-5'>Inicia Sesión</h1>
        
        <Form
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 10 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              { 
                required: true, 
                message: 'Please input your mail!' 
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 7, span: 10 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>

  );
} 

export default LogIn;