// src/components/UserTable.js

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';
import './UserTable.css';

function UserTable() {
  const [users, setUsers] = useState([]);
  const [editMode, setEditMode] = useState({ id: null });
  const [editData, setEditData] = useState({});

  const userTableCollection = collection(db, 'usertable');
  const userQuery = query(userTableCollection, orderBy('Name'));

  useEffect(() => {
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const updatedUsers = [];
      querySnapshot.forEach((doc) => {
        updatedUsers.push({ id: doc.id, ...doc.data() });
      });
      setUsers(updatedUsers);
    });

    return () => {
      unsubscribe();
    };
  }, [userQuery]);

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const userDoc = doc(userTableCollection, id);
        await deleteDoc(userDoc);
      } catch (error) {
        console.error('Error deleting user: ', error);
      }
    }
  };

  const handleFieldChange = (e, id, field) => {
    const newValue = e.target.value;

    setUsers((prevState) =>
      prevState.map((user) =>
        user.id === id ? { ...user, [field]: newValue } : user
      )
    );

    setEditData({ ...editData, [field]: newValue });
  };

  const saveEditedData = async (id) => {
    try {
      const userDoc = doc(userTableCollection, id);
      await updateDoc(userDoc, editData);
      setEditMode({ id: null });
    } catch (error) {
      console.error('Error updating user: ', error);
    }
  };

  const editUser = async (id) => {
    try {
      const docRef = doc(userTableCollection, id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setEditData(userData);
        setEditMode({ id });
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user for editing: ', error);
    }
  };

  return (
    <div>
      <h2>User Table</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>Gender</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {editMode.id === user.id ? (
                  <input
                    type="text"
                    value={editData.Name}
                    onChange={(e) => handleFieldChange(e, user.id, 'Name')}
                  />
                ) : (
                  user.Name
                )}
              </td>
              <td>
                {editMode.id === user.id ? (
                  <input
                    type="email"
                    value={editData.Email}
                    onChange={(e) => handleFieldChange(e, user.id, 'Email')}
                  />
                ) : (
                  user.Email
                )}
              </td>
              <td>
                {editMode.id === user.id ? (
                  <input
                    type="number"
                    value={editData.Age}
                    onChange={(e) => handleFieldChange(e, user.id, 'Age')}
                  />
                ) : (
                  user.Age
                )}
              </td>
              <td>
                {editMode.id === user.id ? (
                  <select
                    value={editData.Gender}
                    onChange={(e) => handleFieldChange(e, user.id, 'Gender')}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="None">None</option>
                  </select>
                ) : (
                  user.Gender
                )}
              </td>
              <td>
                {editMode.id === user.id ? (
                  <input
                    type="text"
                    value={editData.City}
                    onChange={(e) => handleFieldChange(e, user.id, 'City')}
                  />
                ) : (
                  user.City
                )}
              </td>
              <td>
                {editMode.id === user.id ? (
                  <>
                    <button onClick={() => saveEditedData(user.id)}>Save</button>
                    <button onClick={() => setEditMode({ id: null })}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => editUser(user.id)}>Edit</button>
                )}
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
