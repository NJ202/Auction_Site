import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loaderSlice';
import { GetAllBids, GetProductById } from '../../apicalls/products';
import { Button, Divider, message } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import BidModal from './BidModal';
import moment from 'moment';

function ProductInfo() {
    const { user } = useSelector((state) => state.users);
    const [showAddNewBid, setShowAddNewBid] = React.useState(false);
    const [product, setProduct] = React.useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProductById(id);
            dispatch(SetLoader(false));
            if (response.success) {
                const bidsResponse = await GetAllBids({ product: id });
                setProduct({
                    ...response.data,
                    bids: bidsResponse.data,
                });
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };
    React.useEffect(() => {
        getData();
    }, []);

    return (
        product && (
            <div>
                <div className='grid grid-cols-2 gap-10 mx-60'>
                    {/* Images */}
                    <div className='flex flex-col order-2 border-black-300 rounded-md'>
                        <img
                            src={product.image}
                            alt={product.name}
                            className='w-full h-96 object-cover rounded-md'
                        />
                    </div>
                    {/* details*/}
                    <div className='flex flex-col gap-2'>
                        <div>
                            <h1 className='text-2xl font-semibold'>{product.name}</h1>
                            <span>{product.description}</span>
                        </div>
                        <Divider />
                        <div className='flex flex-col'>
                            <h1 className='text-2xl font-bold'>Product Details</h1>
                            <div className='flex justify-between mt-2'>
                                <span>Starting Bid Price</span>
                                <span> Rs. {product.price}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Category</span>
                                <span>{product.category}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Bill Available</span>
                                <span>: {product.billAvailable ? "Yes" : "No"}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Warranty Available</span>
                                <span>: {product.warrantyAvailable ? "Yes" : "No"}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Box Available</span>
                                <span>: {product.boxAvailable ? "Yes" : "No"}</span>
                            </div>
                            <Divider />
                        </div>
                        <div className='flex flex-col'>
                            <h1 className='text-2xl font-bold'>Seller Details</h1>
                            <div className='flex justify-between mt-2'>
                                <span>Name</span>
                                <span>{product.seller.name}</span>
                            </div>
                            <div className='flex justify-between mt-2'>
                                <span>Email</span>
                                <span>{product.seller.email}</span>
                            </div>
                            <Divider />
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex justify-between'>
                                <h1 className='text-2xl font-bold'>Bids</h1>
                                <Button type="primary" onClick={() => setShowAddNewBid(!showAddNewBid)}
                                    disabled={user._id === product.seller._id}>
                                    Place Bid
                                </Button>
                            </div>
                                                        {product.bids.length > 0 && (
                                <div className='flex justify-between mt-2'>
                                    <span>Highest Bid Amount</span>
                                    <span>Rs. {product.bids[0].bidAmount}</span>
                                </div>
                            )}
                            <Divider />
                        {product.bids.map((bid) => {
                            return (
                            <div className='border border-gray-300 border-solid p-2 rounded mt-3'>
                                <div className='flex justify-between mt-2 text-gray-600'>
                                    <span>Bidder Name</span>
                                    <span>{bid.buyer.name}</span>
                                    </div>
                                    <div className='flex justify-between mt-2 text-gray-700'>
                                    <span>Bid Amount</span>
                                    <span>Rs. {bid.bidAmount}</span>
                                    </div>
                                    <div className='flex justify-between mt-2 text-gray-600'>
                                    <span>Bid Placed On</span>
                                    <span>{
                                    moment(bid.createAt).format("DD-MM-YYYY")}</span>
                                    </div>
                                </div>
                            );

                        })}
                        </div>
                    </div>
                </div>

                {showAddNewBid && (
                    <BidModal
                        product={product}
                        reloadData={getData}
                        showBidModal={showAddNewBid}
                        setShowBidModal={setShowAddNewBid}
                    />
                )}
            </div>
        )
    );
}

export default ProductInfo;
