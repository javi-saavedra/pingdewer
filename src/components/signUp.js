import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from "axios";
import NavBar from './navbar';
import { useNavigate } from "react-router-dom";

function SignUp() {
  let navigate = useNavigate();

  const onFinish = (values) => {
    let url = "https://ewelovescats.tk/users";

    const instance = axios.create({
      baseURL: url
    });
    
    instance.defaults.headers.common['Content-Type'] = 'application/json'

    axios
      .post(url, values)
      .then((response) => {
        message.success('Usuario registrado correctamente');
        navigate('/login');
      })
      .catch((err) => {
        message.error('Ocurrió un error al registrar el usuario, cambia tu nombre de usuario o revisa que no exista una cuenta con tu correo.');
      });
  };

  const prefixPhone = (
    <Form.Item name="prefix" noStyle>
      +56
    </Form.Item>
  );

  return (
    <div>
      <NavBar/>
      <div className='rounded-lg border border-gray-100 py-7 px-4 mx-20 my-10 shadow'>
        <h1 className='text-2xl text-blue-600 text-center mb-5'>Regístrate</h1>
        <Form
          name="basic"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 10 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="Nombre de usuario"
            name="nickname"
            rules={[{ required: true, message: 'Please input your nickname!' }]}
          >
            <Input />
          </Form.Item>

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
            label="Teléfono"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone!' }]}
          >
            <Input addonBefore={prefixPhone}/>
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { min: 6, message: 'Password must be minimum 6 characters.' },
              { required: true, message: 'Please input your password!' }
            ]}
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

export default SignUp;