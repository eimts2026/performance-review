import { useState, useEffect } from 'react';
import { db } from './firebase';
import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot
} from 'firebase/firestore';

export default function UserList() {
    const [users, setUsers] = useState([])
    const [newUser, setNewUser] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editingName, setEditingName] = useState('')

    // Reading the database
    const collectionRef = collection(db, 'Users');
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const dataArray = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
        setUsers(dataArray)
    })

    return () => unsubscribe();




}