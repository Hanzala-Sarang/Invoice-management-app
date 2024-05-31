import React, { useState } from "react";
import "./Dashboard.css";
import { useFirebase } from "../../firebase/FirebaseProvider";
import { useNavigate } from "react-router-dom";
const NewInvoice = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const [to, setTo] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState(1);
  const [total, setTotal] = useState(0);
  const uid = localStorage.getItem("uid");

  const [products, setProducts] = useState([]);

  const addProduct = () => {
    setProducts([
      ...products,
      {
        id: products.length,
        productName: productName,
        price: price,
        qty: qty,
      },
    ]);
    const t = qty * price;
    setTotal(total + t);
    setProductName("");
    setPrice("");
    setQty(1);
  };

  const saveInvoice = async () => {
    await firebase.addNewInvoice(to, phone, address, products, total, uid);
    navigate("/dashboard/invoices");
  };
  return (
    <div>
      <div className="invoice-header">
        <p className="new-invoice-heading">New Invoice</p>
        <button type="button" className="add-btn" onClick={saveInvoice}>
          Save Invoice
        </button>
      </div>
      <form className="new-invoice-form">
        <div className="first-row">
          <input
            type="text"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="first-row">
          <input
            type="text"
            placeholder="Product name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
          />
        </div>
        <button type="button" className="add-btn" onClick={addProduct}>
          Add Product
        </button>
      </form>

      {products.length ? (
        <div className="products-wrapper scrollable">
          <div className="products-list">
            <h4>Sr.No</h4>
            <h4>Product Name</h4>
            <h4>Price</h4>
            <h4>Quantity</h4>
            <h4>Total Price</h4>
          </div>
          {products.map((item, index) => (
            <div key={index} className="products-list ">
              <p>{index + 1}</p>
              <p>{item.productName}</p>
              <p>{item.price}</p>
              <p>{item.qty}</p>
              <p>{item.price * item.qty}</p>
            </div>
          ))}
          <div className="total-wrapper">
            <p>Total: {total}</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NewInvoice;
