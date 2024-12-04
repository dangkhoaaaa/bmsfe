import React, { useState, useEffect } from 'react';
import './ShopPackagePage.scss';
import { useNavigate } from 'react-router-dom';
import { ApiCreatePackage, ApiDeletePackage, ApiGetPackageForShopInUse, ApiGetPackages, ApiUpdatePackage } from '../../services/PackageServices';
import Avatar from '@mui/material/Avatar';
import { GetImagePackage } from '../../utils/StringUtils';
import Button from '@mui/material/Button';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const PackagePage = () => {
  const [packages, setPackages] = useState([]);
  const [packageBoughts, setPackageBoughts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const PAGE_SIZE_DEFAULT = 10;
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false); // Quản lý trạng thái dialog
  const token = localStorage.getItem('token');

  const [currentPackage, setCurrentPackage] = useState({
    id: null,
    name: '',
    duration: '',
    price: '',
    description: '',
  }); // Package hiện tại
  const [isUpdate, setIsUpdate] = useState(false); // Phân biệt giữa Add và Update
  const handleOpenDialogAdd = () => {
    setIsUpdate(false);
    setCurrentPackage({ id: null, name: '', duration: '', price: '', description: '' });
    setDialogOpen(true);
  };
  const handleOpenDialogUpdate = (id) => {
    const selectedPackage = packages.find((pkg) => pkg.id === id);
    setCurrentPackage(selectedPackage);
    setIsUpdate(true);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  const handleSavePackage = async () => {
    var result = null;
    if (isUpdate) {
      result = await ApiUpdatePackage(currentPackage.id, currentPackage.name, currentPackage.price, currentPackage.description, currentPackage.duration, token);
    } else {
      result = await ApiCreatePackage(currentPackage.name, currentPackage.price, currentPackage.description, currentPackage.duration, token);
    }
    if (result.ok) {
      alert("Successfully!");
    } else {
      alert(result.message);
      return;
    }
    setDialogOpen(false);
    fetchPackages(); // Refresh danh sách packages
  };
  useEffect(() => {
    fetchPackages();
  }, [currentPage, searchTerm]);

  const fetchPackages = async () => {
    const token = localStorage.getItem('token');
    const result = await ApiGetPackages(searchTerm, true, currentPage, PAGE_SIZE_DEFAULT, token);
    if (result.ok) {
      const packageList = result.body.data.data; // Danh sách packages
      const total = Math.ceil(result.body.data.total / PAGE_SIZE_DEFAULT);
      setPackages(packageList);
      setTotalPages(total);
    } else {
      alert(result.message);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  const handleDeletePackage = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this package?");
    if (confirmDelete) {
      const result = await ApiDeletePackage(id, token);
      if (result.ok) {
        alert("Package deleted successfully!");
        fetchPackages(); // Refresh danh sách packages sau khi xóa
      } else {
        alert(result.message);
      }
    }
  };

  return (
    <div className="coupon-container">
      <h1>PACKAGES</h1>
      <div className="coupon-box">
        <div className="search-and-add">
          <input
            type="text"
            placeholder="Search Packages"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-bar"
          />
          <Button
            variant="contained"
            onClick={handleOpenDialogAdd}
            sx={{
              background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)', // Linear gradient xanh lá
              color: '#fff', // Màu chữ trắng
              borderRadius: '8px', // Bo góc
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Tạo hiệu ứng shadow
              '&:hover': {
                background: 'linear-gradient(135deg, #429321, #0f9b0f, #006400)', // Màu xanh đậm hơn khi hover
              },
            }}
          >
            Add Package
          </Button>
        </div>
        <table className="coupon-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {packages.length > 0 ? (
              packages.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className='d-flex justify-content-center'>
                      <Avatar
                        src={`/${GetImagePackage(row.name)}`}
                        alt={`${row.name} package`}
                        variant="rounded" // Optional: 'circle' or 'square' are other options
                        sx={{ width: 100, height: 100 }} // Adjust size as needed
                      />
                    </div>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.duration}</td>
                  <td>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(row.price)}
                  </td>
                  <td>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialogUpdate(row.id)} sx={{
                      borderRadius: '15px',
                      fontSize: '16px',
                      background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
                      boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
                    }}>Update Now</Button>
                    <Button variant="contained" color="primary" onClick={() => handleDeletePackage(row.id)} sx={{
                      borderRadius: '15px',
                      fontSize: '16px',
                      background: 'linear-gradient(135deg, #ff9a9e, #ff6a88, #ff3d71)',
                      boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
                      marginInlineStart: 2
                    }}>Delete</Button>
                  </td>
                  <td>{row.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No packages found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || totalPages === 0}
            className={currentPage === 1 || totalPages === 0 ? 'disabled' : ''}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages > 0 ? totalPages : 1}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}
          >
            Next
          </button>
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{isUpdate ? 'Update Package' : 'Add Package'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={currentPackage.name}
            onChange={(e) => setCurrentPackage({ ...currentPackage, name: e.target.value })}
          />
          <TextField
            label="Duration"
            fullWidth
            margin="normal"
            value={currentPackage.duration}
            onChange={(e) => setCurrentPackage({ ...currentPackage, duration: e.target.value })}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            margin="normal"
            value={currentPackage.price}
            onChange={(e) => setCurrentPackage({ ...currentPackage, price: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={currentPackage.description}
            onChange={(e) => setCurrentPackage({ ...currentPackage, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
          <Button onClick={handleSavePackage} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PackagePage;
