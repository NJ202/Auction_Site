import { Button, message, Table } from "antd";
import React, { useEffect } from "react";
import ProductsForm from "./ProductsForm";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProduct, GetProducts } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loaderSlice";
import moment from "moment";
import Bids from "./Bids";

function Products() {
    const [showBids, setShowBids] = React.useState(false);

    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [products, setProducts] = React.useState([]);
    const [showProductForm, setShowProductForm] = React.useState(false);
    const { user } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProducts({
                seller: user._id,
            });
            dispatch(SetLoader(false));
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    const deleteProduct = async (id) => {
        try {
            dispatch(SetLoader(true));
            const response = await DeleteProduct(id);
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
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
            title: "Image",
            dataIndex: "image",
            render: (text, record) => {
                console.log(record.image); // Check if the image URL is being retrieved correctly
                return (
                    <img
                        src={record.image}
                        alt={record.name}
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                        onError={(e) => e.target.style.display = 'none'} // Hide broken images
                    />
                );
            },
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Description",
            dataIndex: "description",
        },
        {
            title: "Price",
            dataIndex: "price",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Bid End Date",
            dataIndex: "bidEndDate",
            render: (text, record) => moment(record.createdAt).format("DD-MM-YYYY")
        },
        {
            title: "Added On",
            dataIndex: "createdAt",
            render: (text, record) => moment(record.createdAt).format("DD-MM-YYYY hh:mm A")
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (text, record) => {
                return (
                    <div className="flex gap-5 item-center">
                        <i className="ri-delete-bin-line cursor-pointer" onClick={() => {
                            deleteProduct(record._id);
                        }}></i>
                        <i className="ri-pencil-line cursor-pointer" onClick={() => {
                            setSelectedProduct(record);
                            setShowProductForm(true);
                        }}></i>
                        <span className="underline cursor-pointer" onClick={()=>{
                            setSelectedProduct(record);
                            setShowBids(true);
                        }}>Show Bids</span>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <div className="flex justify-end mb-2">
                <Button type="default" onClick={() => {
                    setSelectedProduct(null);
                    setShowProductForm(true);
                }}>
                    Add Product
                </Button>
            </div>
            <Table columns={columns} dataSource={products} />
            {showProductForm && (
                <ProductsForm
                    showProductForm={showProductForm}
                    setShowProductForm={setShowProductForm}
                    selectedProduct={selectedProduct}
                    getData={getData}
                />
            )}
            {showBids && (
                <Bids 
                    showBidsModal={showBids}
                    setShowBidsModal={setShowBids}
                    selectedProduct={selectedProduct} />

            )}
        </div>
    );
}

export default Products;
