// src/components/UserForm.js

import React, { useState } from 'react';
import { db } from '../firebase';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import './UserForm.css';

function UserForm() {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Age: '',
    Gender: '',
    City: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userTableCollection = collection(db, 'usertable');

    // Check if the email already exists in the database
    const emailExistsQuery = query(userTableCollection, where('Email', '==', formData.Email));
    const emailExistsSnapshot = await getDocs(emailExistsQuery);

    if (emailExistsSnapshot.empty) {
      try {
        await addDoc(userTableCollection, formData);
        setFormData({
          Name: '',
          Email: '',
          Age: '',
          Gender: '',
          City: '',
        });
      } catch (error) {
        console.error('Error adding user: ', error);
      }
    } else {
      alert('Email already exists. Please use a different email address.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container">
      <h2>User Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={formData.Age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="Gender"
            value={formData.Gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="None">None</option>
          </select>
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="City"
            value={formData.City}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
