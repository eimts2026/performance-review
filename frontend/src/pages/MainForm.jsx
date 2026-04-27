import './MainForm.css'

function MainForm() {
    return (
        <>
            <section class='form-section'>
                <div class='info'>
                    <h1>Appraisal Form</h1>
                    <p>This is the form needed to fill employees appraisal</p>
                </div>

                <div class='form-skeleton'>
                    <form class='form'>
                        <br />
                        <label for='fname'>First Name:</label><br />
                        <input type='text' id='fname' name='fnmae' placeholder='e.g. Perera Amarokon' /><br />
                    </form>
                </div>
            </section>
        </>
    );
}

export default MainForm;