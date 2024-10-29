import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Optional: Add PropTypes for type checking
import { getProducts, getCustomers, addCustomer, deleteCustomer } from '../../services/api';
import ProductList from '../Product/ProductList';
import GenerateInvoice from '../Invoice/GenerateInvoice';
import InvoiceList from '../Invoice/InvoiceList'; // Import InvoiceList
import './AdminDashboard.css';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import HomeIcon from '@mui/icons-material/Home';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import PeopleIcon from '@mui/icons-material/People';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showGenerateInvoice, setShowGenerateInvoice] = useState(false);
  const [newCustomers, setNewCustomers] = useState([{ name: '', email: '' }]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [addingCustomers, setAddingCustomers] = useState(false);
  const [deletingCustomerId, setDeletingCustomerId] = useState(null);
  const [showDiv, setShowDiv] = useState(false);
  const [showDivcustomer, setShowDivcustomer] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, customersData] = await Promise.all([
          getProducts(),
          getCustomers(),
        ]);

        setProducts(productsData.data);
        setCustomers(customersData.data);
      } catch (error) {
        setErrorMessage('Error fetching data. Please try again later.');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCustomerField = () => {
    setNewCustomers(prev => [...prev, { name: '', email: '' }]);
  };
  const handleToggleDiv = () => {
    setShowDiv(true);
  };
   // Function to hide the div
   const handleCloseDiv = () => {
    setShowDiv(false);
  };
  const handleToggleDivshowcus=()=>{
    setShowDivcustomer(true)
  }
  const handlecloseDivshowcus=()=>{
    setShowDivcustomer(false)
  }
  
  
  const handleCustomerChange = (index, field, value) => {
    setNewCustomers(prevCustomers =>
      prevCustomers.map((customer, i) => (i === index ? { ...customer, [field]: value } : customer))
    );
  };

  const handleBatchAddCustomers = async () => {
    const validCustomers = newCustomers.filter(customer => customer.name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email));

    if (validCustomers.length === 0) {
      setErrorMessage('Please fill out valid names and emails for each customer.');
      return;
    }

    setAddingCustomers(true);
    try {
      const addedCustomers = await Promise.all(validCustomers.map(addCustomer));
      setCustomers(prev => [...prev, ...addedCustomers.map(res => res.data)]);
      setNewCustomers([{ name: '', email: '' }]);
      setSuccessMessage('Customers added successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding customers:', error);
      setErrorMessage('Failed to add customers.');
    } finally {
      setAddingCustomers(false);
    }
  };

  const handleDeleteCustomer = async (id) => {
    setDeletingCustomerId(id);
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      setSuccessMessage('Customer deleted successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Error deleting customer:', error);
      setErrorMessage('Failed to delete customer.');
    } finally {
      setDeletingCustomerId(null);
    }
  };

  return (
    <>
    <div className="headerbox">
        <h1>Admin Dashboard</h1>
      </div>
    <div className="admin-dashboard">
      <div className="leftside">
        <a href=""><HomeIcon sx={{ color: 'theme.palette.primary.main', fontSize: 54, marginLeft: '16px' }} /><br></br>&nbsp;&nbsp;&nbsp;&nbsp;Home</a>
        <a href="/addproduct" ><AddShoppingCartIcon sx={{ fontSize: 54, color: 'primary.main',marginLeft: '16px' }} /><br></br>Add Product</a>
        <a href="#" onClick={handleToggleDiv}><PersonAddAltIcon sx={{ color: 'theme.palette.primary.main', fontSize: 54,marginLeft: '16px' }}/><br></br>Add Customer</a>
        <a href="#" onClick={handleToggleDivshowcus} ><PeopleIcon sx={{ color: 'theme.palette.primary.main', fontSize: 54,marginLeft: '16px' }} /><br></br>Show Customers</a>
      </div>
      <div className="rightside">
      
      {loading && <p className="loading">Loading...</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {successMessage && <p className="success">{successMessage}</p>}

      <h2>Products</h2>
      <ProductList products={products} role="admin" />

    {showDivcustomer && (
        <div className="customeradd">
          <h2>Customers</h2>
      <ul>
        {customers.map(customer => (
          <li key={customer.id}>
            {customer.name}
            <button onClick={() => handleDeleteCustomer(customer.id)} disabled={deletingCustomerId === customer.id}>
              {deletingCustomerId === customer.id ? 'Deleting...' : 'Delete'}
            </button>
          </li>
        ))}
      </ul>
      <button id='close' onClick={handlecloseDivshowcus}>Close</button>
        </div>
    )}
      

      {showDiv && (
                  <div className="customeradd">
                   <h3>Add New Customers</h3>
             {newCustomers.map((customer, index) => (
               <div key={index}>
                 <input
                   placeholder="Name"
                   value={customer.name}
                   onChange={(e) => handleCustomerChange(index, 'name', e.target.value)}
                 />
                 <input
                   placeholder="Email"
                   value={customer.email}
                   onChange={(e) => handleCustomerChange(index, 'email', e.target.value)}
                 />
               </div>
             ))}
             <div className="footet">
             <button onClick={handleAddCustomerField}>Add Another Customer</button>
             <button onClick={handleBatchAddCustomers} disabled={addingCustomers}>
               {addingCustomers ? 'Adding...' : 'Submit All Customers'}
             </button>
             </div>
             <button id='close' onClick={handleCloseDiv}>Close</button>
             </div>
             
      )}

      

      <h2>Generate Invoice</h2>
      <button onClick={() => setShowGenerateInvoice(!showGenerateInvoice)}>
        {showGenerateInvoice ? 'Hide Invoice Form' : 'Show Invoice Form'}
      </button>

      {showGenerateInvoice && <GenerateInvoice />}

      <h2>Recent Invoices</h2>
      <InvoiceList /> {/* Display the InvoiceList component here */}
      </div>

    </div>
    </>
  );
}

// PropTypes for the AdminDashboard component
AdminDashboard.propTypes = {
  products: PropTypes.array,
  customers: PropTypes.array,
  showGenerateInvoice: PropTypes.bool,
  newCustomers: PropTypes.array,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
  addingCustomers: PropTypes.bool,
  deletingCustomerId: PropTypes.number,
};

export default AdminDashboard;
