import './MainForm.css'

const form_top = [
    {id: "ap-name", name: "Appraiser Name:", type: "text"},
    {id: "emp-name", name: "Employee Name:", type: "text"},
    {id: "pos", name: "Position:", type: "text"},
    {id: "rev-per", name: "Review Period:", type: "date"},
    {id: "join-dt", name: "Date Joined:", type: "date"},
    {id: "rev-dt", name: "Reviewed Date:", type: "date"},
    {id: "mgr", name: "Manager:", type: "text"},
]

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
                        {form_top.map((forms) => (
                            <>
                                <label for={forms.id}>{forms.name}</label>
                                <input type={forms.type} id={forms.id} />
                            </>
                        ))}
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
                        <tr id='header'>
                            <th id='monitored'>Monitored by HR Department</th>
                            <th>A</th>
                            <th>B</th>
                            <th>C</th>
                            <th>D</th>
                            <th>E</th>
                        </tr>
                    </div>
                </form>
            </section>
        </>
    );
}

export default MainForm;