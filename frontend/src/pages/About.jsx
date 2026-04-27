import './About.css'

function About() {
    return (
        <>
            <section id="about">
                <div class="about-header">
                    <h1>About the Portal</h1>
                    <span class="badge">Internal Use Only</span>
                </div>
                
                <div class="about-content">
                    <p class="lead-text">
                        Emerald Isle is committed to the growth and development of its staff. 
                        This portal was designed to streamline our internal feedback loops and ensure 
                        fair, transparent performance assessments.
                    </p>

                    <div class="mission-statement">
                        <h3>Our Mission</h3>
                        <p>To cultivate a culture of excellence and continuous improvement across all departments of the Isle.</p>
                    </div>

                    <div class="version-info">
                        <p><strong>System Version:</strong> 1.0.0 (Internal Build)</p>
                        <p><strong>Last Updated:</strong> October 2024</p>
                    </div>
                </div>
            </section>
        </>
    );
}

export default About;