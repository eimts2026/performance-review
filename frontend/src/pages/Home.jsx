import './Home.css'

const uses = [
    {id: 1, name: 'Apply Appraisal', link: '/form'},
    {id: 2, name: 'Apply Probation', link: '/home'},
]

function Home() {
    return (
        <>
            <section class="home-section">
                <div class="info">
                    <h1>Home</h1>
                    <p>Check latest performance reviews and appraisal forms ongoing</p>
                </div>
            
                <div class="container">
                    {uses.map((use) => (
                        <a href={use.link}><div id={use.id}>{use.name}</div></a>
                    ))}
                </div>
            </section>
        </>
    );
}

export default Home;