import React, { useRef, useState } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import { useLocation } from "react-router-dom";

const InvoiceDetail = () => {
  const location = useLocation();

  const [data, setData] = useState(location.state);
  const invoiceRef = useRef();

  return (
    <div className="invoice-main-wrapper">
      <div className="invoice-btn">
        <button className="download-btn">
          {" "}
          <DownloadIcon fontSize="small" />
          Download Invoice
        </button>
      </div>
      <div className="invoice-wrapper scrollable" ref={invoiceRef}>
        <div className="invoice-header">
          <div className="company-detail">
            <img
              src={localStorage.getItem("logo")}
              alt="logo"
              className="company-logo"
            />
            <p className="company-name">{localStorage.getItem("cName")}</p>
            <p>{localStorage.getItem("email")}</p>
          </div>
          <div className="customer-detail">
            <h1>Invoice</h1>
            <p>To:- {data.to}</p>
            <p>Phone:- {data.phone}</p>
            <p>Address:- {data.address}</p>
          </div>
        </div>
        <table className="product-table">
          <thead>
            <tr>
              <th>Sr.No</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{product.productName}</td>
                <td>{product.price}</td>
                <td>{product.qty}</td>
                <td>{product.price * product.qty}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="table-footer">
            <tr>
              <td colSpan="4">Total</td>
              <td>{data.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDetail;
