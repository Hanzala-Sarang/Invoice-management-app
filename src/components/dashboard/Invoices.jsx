import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useFirebase } from "../../firebase/FirebaseProvider";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useInvoice } from "../../context/InvoiceProvider";
import SearchInvoice from "./SearchInvoice";
import Loader from "../loader/Loader";

const Invoices = () => {
  const firebase = useFirebase();
  const navigate = useNavigate();

  const { invoices, setInvoices } = useInvoice();
  const [loader, setLoader] = useState(false);
  const uid = localStorage.getItem("uid");
  const [currentInvoiceId, setCurrentInvoiceId] = useState();
  const [open, setOpen] = React.useState(false);

  const handleDelete = async (id) => {
    await firebase.deleteInvoice(id);
    getData();
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const getData = async () => {
    setLoader(true);
    const querySnapshot = await firebase.getAllInvoices(uid);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setInvoices(data);
    setLoader(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="invoices-wrapper">
      {loader ? (
        <Loader />
      ) : (
        <>
          {" "}
          <h2>Invoices</h2>
          <SearchInvoice />
          <h2>All Invoices</h2>
          {invoices.map((invoice) => (
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
        </>
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
              handleDelete(currentInvoiceId);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Invoices;
