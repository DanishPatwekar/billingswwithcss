import { useEffect, useState } from 'react';
import { getInvoiceReports, getCustomerReports, getSalesReport } from '../services/api';

function Reports() {
  const [invoiceReports, setInvoiceReports] = useState([]);
  const [customerReports, setCustomerReports] = useState([]);
  const [salesReports, setSalesReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const invoices = await getInvoiceReports(); 
        const customers = await getCustomerReports(); 
        setInvoiceReports(invoices.data);
        setCustomerReports(customers.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);

  const handleFetchSalesReport = async () => {
    try {
      const sales = await getSalesReport(startDate, endDate);
      setSalesReports(sales.data);
    } catch (error) {
      console.error('Error fetching sales report:', error);
    }
  };

  return (
    <div>
      <h1>Reports</h1>

      <h2>Invoice Reports</h2>
      <ul>
        {invoiceReports.map((report) => (
          <li key={report.id}>{report.details}</li>
        ))}
      </ul>

      <h2>Customer Reports</h2>
      <ul>
        {customerReports.map((report) => (
          <li key={report.id}>{report.details}</li>
        ))}
      </ul>

      <h2>Sales Report</h2>
      <div>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleFetchSalesReport}>Fetch Sales Report</button>
      </div>
      <ul>
        {salesReports.map((report) => (
          <li key={report.id}>{report.details}</li>
        ))}
      </ul>
    </div>
  );
}

export default Reports;
