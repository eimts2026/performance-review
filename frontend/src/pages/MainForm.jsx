import './MainForm.css'

function MainForm() {
    return (
        <>
            <section id="add-employee">
                <h1>New Performance Review</h1>
                <p>Fill out the details below to log a new employee performance assessment.</p>
                
                <form onsubmit="return false;">
                    <div class="form-group">
                        <label for="empName">Employee Full Name</label>
                        <input type="text" id="empName" placeholder="e.g. John Doe" />
                    </div>

                
                    <div class="form-group">
                        <label for="dept">Department</label>
                        <select id="dept">
                            <option value="">Select Department</option>
                            <option value="hr">Human Resources</option>
                            <option value="eng">Engineering</option>
                            <option value="mkt">Marketing</option>
                            <option value="ops">Operations</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="reviewDate">Review Date</label>
                        <input type="date" id="reviewDate" />
                    </div>
                
                    <div class="form-group">
                        <label for="rating">Performance Rating (1-5)</label>
                        <select id="rating">
                            <option value="5">5 - Exceptional</option>
                            <option value="4">4 - Exceeds Expectations</option>
                            <option value="3">3 - Meets Expectations</option>
                            <option value="2">2 - Needs Improvement</option>
                            <option value="1">1 - Unsatisfactory</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="comments">Reviewer Comments</label>
                        <textarea id="comments" rows="5" placeholder="Detailed feedback..."></textarea>
                    </div>

                    <button type="submit">Save Review Record</button>
                </form>
            </section>
        </>
    );
}

export default MainForm;