import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const addUser = async () => {
    try {
        await addDoc(
            collection(db, "users"),
            {
                name: "Joel",
                age: 21
            }
        )

        console.log("User added");
    } catch (error) {
        console.log(error);
    }
}
