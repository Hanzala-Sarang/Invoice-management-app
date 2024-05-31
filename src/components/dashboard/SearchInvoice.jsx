import React, { useState } from "react";
import "./Dashboard.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useInvoice } from "../../context/InvoiceProvider";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useFirebase } from "../../firebase/FirebaseProvider";

const SearchInvoice = () => {
  const [date, setDate] = useState("");
  const [search, setSearch] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState("");
  const [open, setOpen] = useState(false);

  const uid = localStorage.getItem("uid");
  const { invoices, setInvoices, filteredInvoices, setFilteredInvoices } =
    useInvoice();
  const navigate = useNavigate();
  const firebase = useFirebase();

  const filterInvoicesByDate = (date) => {
    const filter = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date.seconds * 1000)
        .toISOString()
        .split("T")[0];

      return invoiceDate == date;
    });
    setFilteredInvoices(filter);
  };
  const getData = async () => {
    const querySnapshot = await firebase.getAllInvoices(uid);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setInvoices(data);
  };

  const handleSearch = (date) => {
    filterInvoicesByDate(date);
    setSearch(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleDeleteInvoice = async (id) => {
    await firebase.deleteInvoice(id);
    getData();
    setOpen(false);
  };
  return (
    <>
      <div className="search-box">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={() => handleSearch(date)}>Search</button>
      </div>
      {search && filteredInvoices.length === 0 ? (
        <>
          <div className="no-invoice">
            <h2>No Invoices found for this Date</h2>
          </div>
        </>
      ) : (
        <div>
          {search && <h2>Search Result</h2>}
          {filteredInvoices.map((invoice) => (
            <div className="invoice-box" key={invoice.id}>
              <p>{invoice.to}</p>
              <p>
                {new Date(invoice.date.seconds * 1000).toLocaleDateString()}
              </p>
              <p> ₹ {invoice.total}</p>
              <button
                className="view-btn"
                onClick={() =>
                  navigate("/dashboard/invoice-detail", { state: invoice })
                }
              >
                <VisibilityIcon fontSize="small" /> View
              </button>
              <DeleteForeverIcon
                onClick={() => {
                  setCurrentInvoiceId(invoice.id);
                  handleOpen();
                }}
                className="dlt-btn"
              />
            </div>
          ))}
        </div>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#14213d",
            padding: "20px", // Change the background color of the dialog
          },
        }}
      >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: "#ffffff",
              fontSize: "20px",
              marginBottom: "10px",
            }}
            id="alert-dialog-description"
          >
            Are you sure ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              backgroundColor: "#0077b6",
              color: "#ffffff",
              border: "none",
              "&:hover": {
                backgroundColor: "#006699",
              },
            }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            sx={{
              backgroundColor: "#dc2f02",
              color: "#ffffff",
              border: "none",
              "&:hover": {
                backgroundColor: "#d00000",
              },
            }}
            onClick={() => {
              handleDeleteInvoice(currentInvoiceId);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SearchInvoice;
