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
   const createUser = async (newName, newAge) => {
    await addDoc(usersCollectionRef, {
        name: newAge,
        age: Number(newAge)
    })
   }

   useEffect(() => {
    const getUsers = async () => {
        const data = await getDocs(usersCollectionRef)
    }

    setNewUser(data.docs.map((doc) =>))
   })


}