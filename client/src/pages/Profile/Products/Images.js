
import { Button, message, Upload } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { SetLoader } from "../../../redux/loaderSlice";
import { EditProduct, UploadProductImage } from "../../../apicalls/products";

function Images({ selectedProduct, setShowProductForm, getData }) {
    const [showPreview, setShowPreview] = React.useState(false);
    const [image, setImage] = React.useState(selectedProduct.image || null);
    const [file, setFile] = React.useState(null);
    const dispatch = useDispatch();

    const upload = async () => {
        try {
            dispatch(SetLoader(true));
            // Upload image to cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('productId', selectedProduct._id);
            const response = await UploadProductImage(formData);
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                setImage(response.data);
                setShowPreview(false);
                setFile(null);
                getData();
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    const deleteImage = async () => {
        try {
            const updatedProduct = { ...selectedProduct, image: null };
            const response = await EditProduct(selectedProduct._id, updatedProduct);
            dispatch(SetLoader(true));
            if (response.success) {
                message.success(response.message);
                setImage(null);
                setFile(null);
                getData();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    return (
        <div>
            <div className="flex gap-5 mb-5">
                {image && (
                    <div className="flex gap-2 border border-solid border-gray-500 rounded p-2 items-end">
                        <img className="h-20 w-20 object-cover" src={image} alt="Product" />
                        <i className="ri-delete-bin-line cursor-pointer" onClick={deleteImage}></i>
                    </div>
                )}
            </div>
            <Upload
                listType="picture"
                beforeUpload={() => false}
                onChange={(info) => {
                    setFile(info.file);
                    setShowPreview(true);
                }}
                fileList={file ? [file] : []}
                showUploadList={showPreview}>
                <Button type="dashed">Upload Image</Button>
            </Upload>

            <div className="flex justify-end gap-5 mt-5">
                <Button type="default" onClick={() => {
                    setShowProductForm(false);
                }}>
                    Cancel
                </Button>
                <Button disabled={!file} type="primary" onClick={upload}>Upload</Button>
            </div>
        </div>
    )
}

export default Images;