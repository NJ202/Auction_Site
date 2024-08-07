import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from 'antd';
import store from './redux/store';
import {Provider} from "react-redux"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ConfigProvider theme={{
      components : {
        Button : {colorPrimary : '#E68369',colorPrimaryHover : '#c28474', borderRadius : '5px',},
        Form: {
          fontSize: '18px',
        },
        Checkbox: {
          fontSize: '18px',  // Adjust the checkbox label font size here
        },
      },
      token : {
        borderRadius : '5px',
      },
    }}>
      <App />
    </ConfigProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
