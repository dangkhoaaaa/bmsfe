import React, { useState, useRef } from 'react';
import { Grid, TextField } from '@mui/material';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const AddressField = () => {
  const [address, setAddress] = useState('');
  const autocompleteRef = useRef(null);

  const handleLoad = (autocompleteInstance) => {
    autocompleteRef.current = autocompleteInstance;
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        setAddress(place.formatted_address);  // Lấy địa chỉ hợp lệ
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey="AlzaSy_7wn6utn1bBFVWPdQ2jA037hNqkNaxG3Y" libraries={['places']}>
      <Grid item xs={12} sm={12}>
        <Autocomplete onLoad={handleLoad} onPlaceChanged={handlePlaceChanged}>
          <TextField
            name="address"
            required
            fullWidth
            id="address"
            label="input address"
            autoFocus
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            inputRef={(input) => {
              if (autocompleteRef.current) {
                autocompleteRef.current.input = input;
              }
            }}
            InputProps={{
              style: { borderRadius: '30px' },
            }}
          />
        </Autocomplete>
      </Grid>
    </LoadScript>
  );
};

export default AddressField;
