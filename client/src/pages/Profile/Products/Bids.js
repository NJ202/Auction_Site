import { Divider, Modal, Table, message } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loaderSlice";
import moment from 'moment';

function Bids({ showBidsModal, setShowBidsModal, selectedProduct }) {
    const [bidsData, setBidsData] = React.useState([]);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAllBids({ product: selectedProduct._id });
            console.log('API Response:', response); // Log the API response
            dispatch(SetLoader(false));
            if (response.success) {
                setBidsData(response.data);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };
    

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (text,record) => {
                return record.buyer.name;
            },
        },
        {
            title: "Bid Amount",
            dataIndex: "bidAmount",
        },
        {
            title: "Bid Date",
            dataIndex: "createdAt",
            render: (text) => moment(text).format("DD-MM-YYYY"),
        },
    ];
    

    useEffect(() => {
        if (selectedProduct) {
            getData();
        }
    }, [selectedProduct]);
    
    console.log('Bids Data:', bidsData); // Log the bids data to verify format
    
    return (
        <Modal title="" open={showBidsModal} onCancel={() => setShowBidsModal(false)} centered width={800} footer={null}>
            <div className="flex flex-col gap-5">
                <h1 className="text-2xl text-default">Bids</h1>
                <h1 className="text-xl text-gray-500">
                    Product Name: {selectedProduct.name}
                </h1>
                <Divider />
                <Table columns={columns} dataSource={bidsData} />
            </div>
        </Modal>
    );
}

export default Bids;
