import React, { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import { Chart } from "chart.js/auto";
import { useInvoice } from "../../context/InvoiceProvider";
import { useFirebase } from "../../firebase/FirebaseProvider";
import Loader from "../loader/Loader";

const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalMonthCollection, setTotalMonthCollection] = useState(0);
  const [loader, setLoader] = useState(false);

  const { invoices, setInvoices } = useInvoice();
  const firebase = useFirebase();
  const uid = localStorage.getItem("uid");
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    getData();

    return () => {
      // Cleanup function to destroy the chart instance if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Recreate the chart whenever the invoices change
    if (invoices.length > 0) {
      getMonthWiseCollection(invoices);
    }
  }, [invoices]);

  const createChart = (chartData) => {
    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "Every Month Collection",
            data: Object.values(chartData),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  const getData = async () => {
    setLoader(true);
    const querySnapshot = await firebase.getAllInvoices(uid);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setInvoices(data);
    getOverallTotal(data);
    getMonthTotal(data);
    setLoader(false);
  };

  const getOverallTotal = (invoicesList) => {
    let sum = 0;
    invoicesList.forEach((invoice) => {
      sum += invoice.total;
    });
    setTotal(sum);
  };

  const getMonthTotal = (invoiceList) => {
    let mt = 0;

    invoiceList.forEach((invoice) => {
      if (
        new Date(invoice.date.seconds * 1000).getMonth() ==
        new Date().getMonth()
      ) {
        mt += invoice.total;
      }
    });

    setTotalMonthCollection(mt);
  };

  const getMonthWiseCollection = (invoiceList) => {
    const chartData = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    invoiceList.forEach((invoice) => {
      if (
        new Date(invoice.date.seconds * 1000).getFullYear() ==
        new Date().getFullYear()
      ) {
        chartData[
          new Date(invoice.date.seconds * 1000).toLocaleDateString("default", {
            month: "long",
          })
        ] += invoice.total;
      }
    });
    createChart(chartData);
  };

  const currentMonth = new Date().getMonth();

  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceMonth = new Date(invoice.date.seconds * 1000).getMonth();
    return invoiceMonth === currentMonth;
  });

  return (
    <div>
      {loader ? (
        <Loader />
      ) : (
        <>
          <div className="home-first-row">
            <div className="home-box box-1">
              <h2>₹ {total}</h2>
              <p>Overall</p>
            </div>
            <div className="home-box box-2">
              <h2>{invoices.length}</h2>
              <p>Total Invoices</p>
            </div>
            <div className="home-box box-3">
              <h2>₹ {totalMonthCollection}</h2>
              <p>This Month</p>
            </div>
          </div>
          <div className="home-second-row">
            <div className="chart-wrapper">
              <canvas id="myChart" ref={canvasRef}></canvas>
            </div>
            <div className="recent-invoice-list">
              <h1>Recent Invoice List</h1>
              <div className="">
                <p>Customer Name</p>
                <p>Date</p>
              </div>
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id}>
                  <p>{invoice.to}</p>
                  <p>
                    {new Date(invoice.date.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
