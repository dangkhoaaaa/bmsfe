import React, { useState, useEffect, useContext } from 'react';
import './PackagePaymentReturn.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiBuyPackage } from '../../services/PackageServices';
import { ApiUpdateBalance, ApiCreateLinkUserDeposit } from '../../services/WalletServices';
import { useWallet } from '../../context/WalletProvider';

const PackagePaymentReturn = () => {
  const { wallet, fetchWallet } = useWallet();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(true);
  const searchParams = new URLSearchParams(location.search);
  const packageId = searchParams.get('packageId');
  const amountSuccess = searchParams.get('amountSuccess');
  const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
  const shopId = localStorage.getItem('shopId');
  const token = localStorage.getItem('token');
  const STATUS_DEPOSIT = 5;
  useEffect(() => {
    const fetchApiBuyPayement = async () => {
      if (vnp_ResponseCode == "00") {
        if (packageId != null) {
          console.log("ApiBuyPackage");
          setIsSuccess(true);
          const result = await ApiBuyPackage(shopId, packageId, token);
          if (result.ok) {
            setTimeout(() => {
              navigate(`/shop/package`);
            }, 3000);
          } else {
            alert(result.message);
          }
        } else if (amountSuccess != null) {
          setIsSuccess(true);
          const result = await ApiUpdateBalance(amountSuccess, STATUS_DEPOSIT, token);
          if (result.ok) {
            fetchWallet();
            setTimeout(() => {
              navigate('/shop/wallet');
            }, 3000);
          } else {
            alert(result.message);
          }
        }
      } else {
        setIsSuccess(false);
      }
    }
    fetchApiBuyPayement();
  }, [amountSuccess, packageId, vnp_ResponseCode]);

  return (
    <div className="coupon-container">
      <div className='d-flex justify-content-center'>
        <div className='text-center'>
          {isSuccess && (
            <div>
              <h1 className='fw-bold'>PAYMENT <span className='text-success'>SUCCESSFUL</span></h1>
              <img src='/Loading_icon.gif' alt='loading' className="thumbnail my-2" style={{ width: 150, height: 'auto', border: 'none' }} />
              <p className='text-secondary'>You will be redirected to the homepage in a few seconds...</p>
            </div>
          ) || (
              <div className='fw-bold'>
                <h1>PAYMENT <span className='text-danger'>FAILED</span></h1>
                <img src='/Loading_icon.gif' alt='loading' className="thumbnail my-2" style={{ width: 150, height: 'auto', border: 'none' }} />
                <p className='text-secondary'>An error occurred during the payment process.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default PackagePaymentReturn;
