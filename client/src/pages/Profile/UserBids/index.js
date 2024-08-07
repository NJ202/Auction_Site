import { Table, message } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from 'moment';
import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loaderSlice";

function UserBids() {
    const [bidsData, setBidsData] = React.useState([]);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetAllBids({ buyer: user._id });
            dispatch(SetLoader(false));
            if (response.success) {
                setBidsData(response.data);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    const columns = [
        {
            title: "Product",
            dataIndex: "product",
            render: (text, record) => {
                return record.product?.name || "N/A";
            },
        },
        {
            title: "Seller",
            dataIndex: "name",
            render: (text, record) => {
                return record.seller?.name || "N/A";
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
        if (user?._id) {
            getData();
        }
    }, [user]);

    return (
        <div className="flex flex-col gap-5">
            <Table columns={columns} dataSource={bidsData} />
        </div>
    );
}

export default UserBids;
