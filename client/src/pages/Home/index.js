import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoader } from '../../redux/loaderSlice';
import { GetProducts, GetAllBids } from '../../apicalls/products';
import { Divider, message } from 'antd';
import { useNavigate } from "react-router-dom";

// Helper function to format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

function Home() {
    const [products, setProducts] = React.useState([]);
    const [filters, setFilters] = React.useState({
        status: 'approved',
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);

    const getData = async () => {
        try {
            dispatch(SetLoader(true));
            const response = await GetProducts(filters);
            dispatch(SetLoader(false));
            if (response.success) {
                const currentDateTime = new Date();
                const productsWithHighestBids = await Promise.all(
                    response.data
                        .filter(product => new Date(product.bidEndDate) > currentDateTime) // Filter out products with expired bid end date
                        .map(async (product) => {
                            const bidsResponse = await GetAllBids({ product: product._id });
                            const highestBid = bidsResponse.data.length > 0 ? bidsResponse.data[0].bidAmount : product.price;
                            return {
                                ...product,
                                highestBid,
                            };
                        })
                );
                setProducts(productsWithHighestBids);
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
        <div>
            <div className='grid grid-cols-5 gap-5'>
                {products?.map((product) => {
                    const formattedBidEndDate = formatDate(product.bidEndDate);

                    return (
                        <div
                            className='border border-gray-300 rounded border-solid flex flex-col gap-1 pb-2 cursor-pointer'
                            key={product._id}
                            onClick={() => navigate(`/product/${product._id}`)}
                        >
                            <img src={product.image} className="w-full h-52 p-2 rounded-md" alt={product.name} />

                            <div className='px-2 flex flex-col'>
                                <h1 className='text-lg font-semibold'>{product.name}</h1>
                                <p className='text-sm text-gray-500'>{product.description}</p>
                                <Divider />
                                <span className='text-lg font-normal'>
                                    Starting Bid: Rs. {product.price}
                                </span>
                                <span className='text-lg font-normal text-green-500'>
                                    Current Highest Bid: Rs. {product.highestBid}
                                </span>
                                <span className='text-lg font-normal text-red-500'>
                                    Bid End Date: {formattedBidEndDate}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;
