import './MainForm.css'
import OptionRender from '../components/OptionRender';

const form_top = [
    {id: "ap-name", name: "Appraiser Name:", type: "text"},
    {id: "emp-name", name: "Employee Name:", type: "text"},
    {id: "pos", name: "Position:", type: "text"},
    {id: "rev-per", name: "Review Period:", type: "date"},
    {id: "join-dt", name: "Date Joined:", type: "date"},
    {id: "rev-dt", name: "Reviewed Date:", type: "date"},
    {id: "mgr", name: "Manager:", type: "text"},
]

const quickRender = (name) => {
    console.log("Quick render received name: ", name);
    const list = []
    const ratings = ["A", "B", "C", "D", "E"]

    for (let i = 0; i < 5; i++) {
        list.push(<td key={i}><OptionRender name = {name} value = {ratings[i]}/></td>)
    }

    return list;
}

function MainForm() {
    return (
        <div style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden', boxSizing: 'border-box' }}>
            <section className='form-section'> 
                <div className='info'>
                    <h1>Appraisal Form</h1>
                    <p>This is the form needed to fill employees appraisal</p>
                </div>
                
                <form className='form' action="https://formsubmit.co/joellawrence742005@gmail.com" method="POST">
                    {/* FORM GRID */}
                    <div className='form-grid'>
                        {form_top.map((forms) => (
                            <div key={forms.id} style={{ display: 'contents' }}>
                                <label htmlFor={forms.id}>{forms.name}</label>
                                <input type={forms.type} id={forms.id} name={forms.name} />
                            </div>
                        ))}
                    </div>

                    {/* INDEX */}
                    <div className='index'>
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
                    <table className='hr-table'>
                        <thead>
                            <tr id='line-1'>
                                <th id='monitored'>Monitored by HR Department</th>
                                <th>A</th>
                                <th>B</th>
                                <th>C</th>
                                <th>D</th>
                                <th>E</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id='line'>
                                <td>Attendance</td>
                                {quickRender("attendance")}
                            </tr>
                            <tr id='line'>
                                <td>Punctuality</td>
                                {quickRender("punctual")}
                            </tr>
                            <tr id='line'>
                                <td>Adhere Management decisions, Company Rules & Regulation</td>
                                {quickRender("management")}
                            </tr>
                            <tr id='line'>
                                <td>Employee Engagement</td>
                                {quickRender("employee")}
                            </tr>
                            <tr id='line'>
                                <td>Professional Qualification</td>
                                {quickRender("professional")}
                            </tr>
                        </tbody>
                    </table>

                    {/* COMMENT SECTION */}
                    <div className='comment-section'>
                        <label id='comment'>Comments:</label>
                        <textarea id='comment-box' name='comment-box' rows='4'></textarea>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <input type="submit" className="review-button" value="Submit Appraisal" />
                </form>
            </section>
        </div>
    );
}

export default MainForm;