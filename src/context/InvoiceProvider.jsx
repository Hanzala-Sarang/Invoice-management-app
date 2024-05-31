import { createContext, useContext, useEffect, useState } from "react";
import { useFirebase } from "../firebase/FirebaseProvider";

const InvoiceContext = createContext(null);

export const useInvoice = () => useContext(InvoiceContext);

const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  return (
    <InvoiceContext.Provider
      value={{ invoices, setInvoices, filteredInvoices, setFilteredInvoices }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceProvider;
