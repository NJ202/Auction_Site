import { Modal, Tabs, Form, Input, Row, Col, Checkbox, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loaderSlice";
import { AddProduct, EditProduct } from "../../../apicalls/products";
import Images from "./Images";

const additionalThings = [
    { label: "Bill Available", name: "billAvailable" },
    { label: "Warranty Available", name: "warrantyAvailable" },
    { label: "Box Available", name: "boxAvailable" },
];

const rules = {
    name: [
        { required: true, message: "Name is required" },
        { min: 3, message: "Name must be at least 3 characters long" }
    ],
    description: [
        { required: true, message: "Description is required" },
        { min: 10, message: "Description must be at least 10 characters long" }
    ],
    price: [
        {
            validator(_, value) {
                if (value === undefined || value === null || value === '') {
                    return Promise.reject(new Error("Price is required"));
                }
                if (isNaN(value)) {
                    return Promise.reject(new Error("Price must be a number"));
                }
                if (Number(value) <= 0) {
                    return Promise.reject(new Error("Price must be greater than 0"));
                }
                return Promise.resolve();
            },
        }
    ],
    category: [
        { required: true, message: "Category is required" }
    ],
    bidEndDate: [
        { required: true, message: "Bid end date is required" },
        {
            validator(_, value) {
                if (!value) {
                    return Promise.reject(new Error("Bid end date is required"));
                }
                const today = new Date();
                const bidEndDate = new Date(value);
                if (isNaN(bidEndDate.getTime())) {
                    return Promise.reject(new Error("Invalid date format"));
                }
                if (bidEndDate <= today) {
                    return Promise.reject(new Error("Bid end date must be a future date"));
                }
                return Promise.resolve();
            },
        }
    ],
};

function ProductsForm({ showProductForm, setShowProductForm, selectedProduct, getData }) {
    const [selectedTab, setSelectedTab] = React.useState("1");
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);
    const formRef = React.useRef(null);

    const onFinish = async (values) => {
        try {
            dispatch(SetLoader(true));
            let response = null;
            if (selectedProduct) {
                response = await EditProduct(selectedProduct._id, values);
            } else {
                values.seller = user._id;
                values.status = "pending";
                response = await AddProduct(values);
            }
            dispatch(SetLoader(false));
            if (response.success) {
                message.success(response.message);
                getData();
                setShowProductForm(false);
            } else {
                message.error(response.message);
            }
        } catch (error) {
            dispatch(SetLoader(false));
            message.error(error.message);
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            formRef.current.setFieldsValue(selectedProduct);
        }
    }, [selectedProduct]);

    return (
        <Modal
            title=""
            open={showProductForm}
            onCancel={() => setShowProductForm(false)}
            centered
            width={800}
            okText="Save"
            onOk={() => {
                formRef.current.submit();
            }}
            {...(selectedTab === "2" && { footer: false })}
        >
            <div>
                <h1 className="text-default text-2xl text-center font-semibold uppercase">
                    {selectedProduct ? "Edit Product" : "Add Product"}
                </h1>
                <Tabs
                    defaultActiveKey="1"
                    activeKey={selectedTab}
                    onChange={(key) => setSelectedTab(key)}
                >
                    <Tabs.TabPane tab="General" key="1">
                        <Form
                            layout="vertical"
                            requiredMark={false}
                            ref={formRef}
                            onFinish={onFinish}
                        >
                            <Form.Item label="Name" name="name" rules={rules.name}>
                                <Input type="text" />
                            </Form.Item>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={rules.description}
                            >
                                <TextArea type="text" />
                            </Form.Item>
                            <Row gutter={[16, 16]}>
                                <Col span={8}>
                                    <Form.Item label="Starting Bid Price" name="price" rules={rules.price}>
                                        <Input type="number" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Category" name="category" rules={rules.category}>
                                        <select>
                                            <option value="">Select</option>
                                            <option value="Electronics">Electronics</option>
                                            <option value="Fashion and Accessories">Fashion and Accessories</option>
                                            <option value="Home and Garden">Home and Garden</option>
                                            <option value="Art and Collectibles">Art and Collectibles</option>
                                            <option value="Books and Media">Books and Media</option>
                                            <option value="Automotive">Automotive</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Bid end Date" name="bidEndDate" rules={rules.bidEndDate}>
                                        <Input type="date" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <div className="flex flex-wrap gap-10">
                                {additionalThings.map((item) => (
                                    <Form.Item
                                        key={item.name}
                                        name={item.name}
                                        valuePropName="checked"
                                        className="custom-checkbox"
                                    >
                                        <Checkbox
                                            onChange={(e) => {
                                                formRef.current.setFieldsValue({
                                                    [item.name]: e.target.checked,
                                                });
                                            }}
                                            checked={formRef.current?.getFieldValue(item.name)}
                                        >
                                            {item.label}
                                        </Checkbox>
                                    </Form.Item>
                                ))}
                            </div>
                        </Form>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Images" key="2" disabled={!selectedProduct}>
                        <Images
                            selectedProduct={selectedProduct}
                            getData={getData}
                            setShowProductForm={setShowProductForm}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </div>
        </Modal>
    );
}

export default ProductsForm;
