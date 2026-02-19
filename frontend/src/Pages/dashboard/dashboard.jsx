import { useState, useEffect } from "react";
import { getItems } from "../../api/itemAPI";
import { getCustomers } from "../../api/customerAPI";
import { getOrders } from "../../api/orderAPI";
import "./dashboard.css";

const DashboardCards = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0); // sum of paid amounts
  const [unpaidAmount, setUnpaidAmount] = useState(0); // sum of unpaid amounts
  const [completeOrders, setCompleteOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [itemsResponse, customersResponse , ordersResponse] = await Promise.all([
          getItems(),
          getCustomers(),
          getOrders()
        ]);
        
        setTotalItems(itemsResponse.data.length);
        setTotalCustomers(customersResponse.data.length);
        setTotalOrders(ordersResponse.data.length);
        
        const paidSum = ordersResponse.data.reduce((acc, ord) => acc + (ord.paidAmount || 0), 0);
        setTotalPaid(paidSum);

        // additional metrics
        const unpaidSum = ordersResponse.data.reduce((acc, ord) => {
          // use unpaidAmount field if available, otherwise compute
          const unpaid = ord.unpaidAmount != null ? ord.unpaidAmount : ((ord.subtotal || 0) - (ord.paidAmount || 0));
          return acc + unpaid;
        }, 0);
        setUnpaidAmount(unpaidSum);

        const completed = ordersResponse.data.filter(o => o.status === "paid").length;
        const pending = ordersResponse.data.filter(o => o.status === "pending").length;
        setCompleteOrders(completed);
        setPendingOrders(pending);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  

  return (
    <div className="dash-container container">
   

      <div className="dash-card violet shadow">
        <div className="dash-icon">
          <i className="fas fa-boxes"></i>
        </div>
        <div className="dash-content">
          <p>Total Items</p>
          <h2>{loading ? "..." : totalItems}</h2>
        </div>
      </div>

   <div className="dash-card blue shadow">
        <div className="dash-icon">
          <i className="fas fa-users"></i>
        </div>
        <div className="dash-content">
          <p>Total Customers</p>
          <h2>{loading ? "..." : totalCustomers}</h2>
        </div>
      </div>
      
      <div className="dash-card orange shadow">
        <div className="dash-icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <div className="dash-content">
          <p>Total Orders</p>
          <h2>{loading ? "..." : totalOrders}</h2>
        </div>
      </div>

      <div className="dash-card teal shadow">
        <div className="dash-icon">
          <i className="fas fa-money-bill-wave"></i>
        </div>
        <div className="dash-content">
          <p>Total Amount </p>
          <h2>₹{loading ? "..." : totalPaid}</h2>
        </div>
      </div>

      {/* second row with three new cards */}
      <div className="dash-card red shadow">
        <div className="dash-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="dash-content">
          <p>Unpaid Amount</p>
          <h2>₹{loading ? "..." : unpaidAmount}</h2>
        </div>
      </div>

      <div className="dash-card green shadow">
        <div className="dash-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <div className="dash-content">
          <p>Complete Orders</p>
          <h2>{loading ? "..." : completeOrders}</h2>
        </div>
      </div>

      <div className="dash-card yellow shadow">
        <div className="dash-icon">
          <i className="fas fa-clock"></i>
        </div>
        <div className="dash-content">
          <p>Pending Orders</p>
          <h2>{loading ? "..." : pendingOrders}</h2>
        </div>
      </div>
   </div>

    
  );
};

export default DashboardCards;
