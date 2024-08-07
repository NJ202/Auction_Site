import { Form, Input, message, Modal } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loaderSlice';
import { PlaceNewBid } from '../../apicalls/products';
import { AddNotification } from '../../apicalls/notifications';

function BidModal({
    showBidModal,
    setShowBidModal,
    product,
    reloadData
}) {
    const { user } = useSelector((state) => state.users);
    const formRef = React.useRef(null);
    const dispatch = useDispatch();
    
    const onFinish = async (values) => {
        try {
            dispatch(SetLoader(true));
            const response = await PlaceNewBid({
                ...values,
                product: product._id,
                seller: product.seller._id,
                buyer: user._id,
            });
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                // Send notification
                const notificationResponse = await AddNotification({
                    title: "A new bid has been placed",
                    message: `A new bid has been placed on your product ${product.name} by ${user.name} for Rs. ${values.bidAmount}`,
                    user: product.seller._id,
                    onclick: '/profile',
                    read: false,
                });
                if (notificationResponse.success) {
                    message.success("Notification sent successfully");
                } else {
                    throw new Error(notificationResponse.message);
                }
                reloadData();
                setShowBidModal(false);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error(error.message);
            dispatch(SetLoader(false));
        }
    };
    
    const rules = [
        { required: true, message: "Required" },
        {
            validator(_, value) {
                if (!value || value >= product.price) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error(`Bid amount must be equal to or higher than Rs. ${product.price}`));
            },
        }
    ];
    
    return (
        <Modal
            onCancel={() => setShowBidModal(false)}
            open={showBidModal}
            centered
            width={600}
            onOk={() => formRef.current.submit()}
        >
            <div className='flex flex-col gap-5 mb-5'>
                <h1 className='text-2xl font-semibold text-orange-600 text-center'>Place New Bid</h1>
                <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                    <Form.Item label="Bid Amount" name="bidAmount" rules={rules}>
                        <Input />
                    </Form.Item>
                </Form>
            </div>
        </Modal>
    );
}

export default BidModal;
