import React, { useEffect, useState } from 'react';
import { Avatar, Badge, message } from 'antd';
import { GetCurrentUser } from '../apicalls/users';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../redux/loaderSlice';
import { SetUser } from '../redux/usersSlice';
import Notifications from './Notifications';
import { GetAllNotifications, ReadAllNotifications } from '../apicalls/notifications';

//children is the page
function ProtectedPage({ children }) {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateToken = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetCurrentUser();
            dispatch(SetLoader(false));
            if (response.success) {
                dispatch(SetUser(response.data));
            } else {
                navigate("/login");
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            navigate("/login");
            message.error(error.message);
        }
    };

    const getNotifications = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAllNotifications();
            dispatch(SetLoader(false));
            if (response.success) {
                setNotifications(response.data);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    const readNotifications = async () => {
        try{
            dispatch(SetLoader(true));
            const response = await ReadAllNotifications();
            dispatch(SetLoader(false));
            if(response.success){
                getNotifications();
            } else{
                throw new Error(response.message);
            }
            } catch (error) {
                dispatch(SetLoader(false));
                message.error(error.message);
            }
        };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            validateToken();
            getNotifications();
        } else {
            message.error("Please Login to continue");
            navigate("/login");
        }

    }, [navigate]);

    return (
        user && (
            <div>
                {/*header*/}
                <div className='flex justify-between items-center bg-secondary p-5'>
                    <h1 className="text-2xl text-white cursor-pointer" onClick={() => navigate("/")}>Bidder's Block</h1>
                    <div className='bg-white py-2 px-5 rounded flex gap-1 items-center'>
                        <Badge count={notifications?.filter((notification) => !notification.read).length} onClick={() => {
                            readNotifications();
                            setShowNotifications(true);}}>
                            <Avatar shape="circle" size="small" icon={<i className="ri-notification-3-fill gap-5 cursor-pointer"></i>} />
                        </Badge>
                        <span className='underline cursor-pointer uppercase' onClick={() => {
                            if (user.role === "user") {
                                navigate("/profile");
                            }
                        }}>
                            {user.name}
                        </span>
                        <i className="ri-logout-box-r-line ml-10 cursor-pointer" onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/login");
                        }}></i>
                    </div>
                </div>
                {/*body*/}
                <div className='p-5'>{children}</div>
                {showNotifications && (
                    <Notifications
                        notifications={notifications}
                        reloadNotifications={setNotifications}
                        showNotifications={showNotifications}
                        setShowNotifications={setShowNotifications}
                    />
                )}
            </div>
        )
    );
}

export default ProtectedPage;
