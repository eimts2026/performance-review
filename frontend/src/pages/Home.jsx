import { useEffect, useState } from 'react';
import axios from "axios"
import './Home.css'

const uses = [
    {id: 1, name: 'Apply Appraisal', link: '/form'},
    {id: 2, name: 'Apply Probation', link: '/home'},
]

function Home() {
    
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await axios.get("http://localhost:8800/users")
                setUsers(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        fetchAllUsers()
    }, [])
    // the empty array means this only runs once

    return (
        <>
            <section className="home-section">
                <div className="info">
                    <h1>Home</h1>
                    <p>Check latest performance reviews and appraisal forms ongoing</p>
                </div>
            
                <div className="container">
                    {uses.map((use) => (
                        <a href={use.link}><div id={use.id}>{use.name}</div></a>
                    ))}
                </div>
            </section>

            {/* <div className="new">
                <h1>hi</h1>
                {users.map(user => (
                    <div className="user" key={user.employee_id}>
                        {user.first_name}
                    </div>
                ))}
            </div> */}
        </>
    );
}

export default Home;