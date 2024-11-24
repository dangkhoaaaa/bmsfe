import React, { useEffect, useState } from 'react';
import { Button, Radio, FormControl, FormLabel, RadioGroup, FormControlLabel } from '@mui/material';
import './PackagePayment.scss';
import { useLocation } from 'react-router-dom';
import { ApiBuyPackage, ApiCreatePaymentVNPayURL, ApiGetPackageById } from '../../services/PackageServices';
import { useNavigate } from 'react-router-dom';

const PackagePayment = () => {
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState('VNPay');
  const [price, setPrice] = useState(0); // Đơn giá VND
  const [packageName, setPackageName] = useState(""); // Đơn giá VND
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const packageId = searchParams.get('packageId');

  useEffect(()=>{
    fetchPackageById(packageId);
  }, []);

  const fetchPackageById = async (packageId) => {
    const token = localStorage.getItem('token');
    const result = await ApiGetPackageById(packageId, token);
    if (result.ok) {
      setPrice(result.body.data.price);
      setPackageName(result.body.data.name);
    } else {
      alert(result.message);
    }
  }

  const handleSubmitPayment = async () => {
    if (selectedPayment === "VNPay") {
      const shopId = localStorage.getItem('shopId');
      const token = localStorage.getItem('token');
      const packagePrice = price < 1000 && price * 100000 || price;
      const result = await ApiCreatePaymentVNPayURL(shopId, packageId, "Customer 1", packageName, Math.round(packagePrice), token);
      if (result.ok) {
        window.location.href = result.body.data;
      } else {
        alert(result.message);
      }
    } else if (selectedPayment === "Momo") {
      alert("This payment method is not support!");
    } else {
      const token = localStorage.getItem('token');
      const shopId = localStorage.getItem('shopId');
      const result = await ApiBuyPackage(shopId, packageId, token);
      if (result.ok) {
        alert("Your package purchase was successful.");
        navigate(`/shop/package`);
      } else {
        alert(result.message);
      }
    }
  };

  const handlePaymentChange = async (event) => {
    const paymentMethod = event.target.value;
    setSelectedPayment(paymentMethod);
  };

  return (
    <div className="coupon-container">
      <div className="payment-container">
        <div className='d-flex justify-content-center row'>
          <div className="list-group payment-options col-12 col-sm-12 col-md-12 col-lg-6" style={{ maxWidth: 500 }}>
            <h2 className='text-center'>Choose Your Payment Method</h2>
            <FormControl component="fieldset">
              <RadioGroup name="payment" value={selectedPayment} onChange={handlePaymentChange}>
                {/* VNPay Option */}
                <FormControlLabel
                  value="VNPay"
                  control={<Radio color="primary" />}
                  label={
                    <div className="list-group-item payment-option mb-3" style={{ height: 80, width: 450 }}>
                      <img src="/PAYMENT_VNPAY.png" alt="VNPay" className="thumbnail" />
                      <span className="payment-label">VNPay</span>
                    </div>
                  }
                />
                {/* Momo Option */}
                <FormControlLabel
                  value="Momo"
                  control={<Radio color="secondary" />}
                  label={
                    <div className="list-group-item payment-option mb-3" style={{ height: 80, width: 450 }}>
                      <img src="/PAYMENT_MOMO.png" alt="Momo" className="thumbnail" />
                      <span className="payment-label">Momo</span>
                    </div>
                  }
                />
                {/* Cash Option */}
                <FormControlLabel
                  value="Cash"
                  control={<Radio color="default" />}
                  label={
                    <div className="list-group-item payment-option" style={{ height: 80, width: 450 }}>
                      <img src="/PAYMENT_CASH.png" alt="Cash" className="thumbnail" />
                      <span className="payment-label">Cash</span>
                    </div>
                  }
                />
              </RadioGroup>
            </FormControl>
            {/* Price Display */}
            <div className="price-display text-center">
              <h3>Total Price: {price.toLocaleString('vi-VN')} VND</h3>
            </div>
            {/* Pay Now Button */}
            <Button variant="contained" color="primary" onClick={handleSubmitPayment} sx={{
              borderRadius: '15px',
              fontSize: '16px',
              background: 'linear-gradient(135deg, #b4ec51, #429321, #0f9b0f)',
              boxShadow: '0px 6px 12px rgba(0,0,0,0.1)',
            }}>Pay Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagePayment;