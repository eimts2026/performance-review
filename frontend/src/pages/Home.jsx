import './Home.css'

function Home() {
    return (
        <>
            <section id="home" class="active">
                <h1>Welcome back, Admin</h1>
                <p>This is the internal performance management portal for Emerald Isle. Use the links above to manage employee records and conduct reviews.</p>
                
                <div class="card">
                    <h3>Quick Stats</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <span class="stat-label">Pending Reviews</span>
                            <span class="stat-value">12</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Total Employees</span>
                            <span class="stat-value">154</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
