import { useState } from "react";

function Person() {
    const [person, setPerson] = useState({ name: "John", age: 100 })

    const handleIncreaseAge = () => {
        const newPerson = { ...person, age: person.age + 1}
        setPerson(newPerson)
    }

    return (
        <>
            <h1>{person.name}</h1>
            <h1>{person.age}</h1>
            <button onClick={handleIncreaseAge}>Increase Age</button>
        </>
    );
}

export default Person