import {Modal } from "antd";
import React from "react";


function Notifications({
    notifications = [],
    reloadNotifications,
    showNotifications,
    setShowNotifications,
}) {
    return (
        <Modal
            title="Notifications"
            open={showNotifications}
            onCancel={() => setShowNotifications(false)}
            footer={null}
            centered
            width={650}
        >
            <div className="flex flex-col gap-2">
                {notifications.map((notification, index) => (
                    <div className="flex flex-col border-solid p-2 border-gray-300 rounded">
                        <h1>
                            {notification.title}
                        </h1>
                        <span className="text-gray-500">
                            {notification.message}
                        </span>

                    </div>
                ))}
            </div>
            {/* Notification list content goes here */}
        </Modal>
    );
}

export default Notifications;



