import React from 'react';
import { useSelector } from 'react-redux';

function UserInfo() {
    const { user } = useSelector((state) => state.users);

    return (
        <div className="user-info">
            <h1 className="text-2xl font-bold">User Information</h1>
            <div className="user-details mt-4">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                {/* Add more fields as necessary */}
            </div>
        </div>
    );
}

export default UserInfo;
