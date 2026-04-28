import './MainForm.css'

function MainForm() {
    return (
        <>
            <section class='form-section'>
                <div class='info'>
                    <h1>Appraisal Form</h1>
                    <p>This is the form needed to fill employees appraisal</p>
                </div>
                
                <br />
                <form class='form'>
                    {/* FORM GRID */}
                    <div class='form-grid'>
                        <div id='ap-name'>
                            <label for='ap-name'>Appraiser Name:</label>
                            <input type='text' id='ap-name' />
                        </div>

                        <div id='emp-name'>
                            <label for='emp-name'>Employee Name:</label>
                            <input type='text' id='emp-name' />
                        </div>

                        <div id='pos'>
                            <label for='pos'>Position</label>
                            <input type='text' id='pos' />
                        </div>

                        <div id='rev-per'>
                            <label for='rev-per'>Review Period:</label>
                            <input type='number' id='rev-per' />
                        </div>

                        <div id='join-dt'>
                            <label for='join-dt'>Date Joined:</label>
                            <input type='date' id='join-dt' />
                        </div>

                        <div id='rev-dt'>
                            <label for='rev-dt'>Reviewed Date:</label>
                            <input type='date' id='rev-dt' />
                        </div>
                    </div>

                    {/* INDEX */}
                    <div class='index'>
                        <h3>Index</h3>
                        <ul id='list'>
                            <li>A = Excellent</li>
                            <li>B = Good</li>
                            <li>C = Satisfactory</li>
                            <li>D = Fair</li>
                            <li>E = Poor</li>
                        </ul>
                    </div>

                    {/* HR MONITORING GRID */}
                    <div class='hr'>
                        {/* Have to add a map function to easily render it */}
                    </div>
                </form>
            </section>
        </>
    );
}

export default MainForm;