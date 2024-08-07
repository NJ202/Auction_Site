import React, { useEffect } from 'react';
import { Button, Divider, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LoginUser } from '../../apicalls/users';
import { useDispatch } from 'react-redux';
import { SetLoader } from '../../redux/loaderSlice';

/* validation rules */
const rules = {
  email: [
    {
      required: true,
      message: 'Email is required',
    },
    {
      type: 'email',
      message: 'The input is not a valid email address',
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
    },
    {
      min: 6,
      message: 'Password must be at least 6 characters',
    },
  ],
};

function Login() {
  const navigate = useNavigate();
  const dispatch =useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true))
      const response = await LoginUser(values);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      }
      else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  //if token exists it doesnt redirect to login or registration
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className='h-screen bg-primary flex justify-center items-center'>
      <div className='bg-white p-7 rounded w-[450px]'>
      <div className='text-center mb-4'>
          <h1 className='text-2xl font-bold text-secondary'>Welcome to Bidder's Block</h1>
        </div>
        <h1 className='text-default text-center'> LOGIN</h1>
        <Divider />
        <Form layout='vertical' onFinish={onFinish} requiredMark={false}>
          <Form.Item label='Email' name='email' rules={rules.email}>
            <Input type='email' placeholder='Email' />
          </Form.Item>
          <Form.Item label='Password' name='password' rules={rules.password}>
            <Input type='password' placeholder='Password' />
          </Form.Item>

          <Button type='primary' htmlType='submit' block className='mt-2'>
            Login
          </Button>

          <div className='mt-5 text-center'>
            <span className='text-gray-500'>
              Don't have an account? <Link to='/register' className='text-default'>Register</Link>
            </span>
          </div>

        </Form>
      </div>
    </div>
  );
}

export default Login;