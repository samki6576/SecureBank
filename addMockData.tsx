// src/addMockData.js
import { db } from './firebase/firebasecon';
import { collection, addDoc } from 'firebase/firestore';
import { fetchMockUsers } from './mockApi';

const addMockUsersToFirestore = async () => {
  const users = await fetchMockUsers();

  for (const user of users) {
    await addDoc(collection(db, 'users'), {
      name: `${user.firstname} ${user.lastname}`,
      email: user.email,
      phone: user.phone,
      balance: Math.floor(Math.random() * 10000),
      kycVerified: false,
      createdAt: new Date()
    });
  }

  console.log('Mock users added to Firestore!');
};

addMockUsersToFirestore();
