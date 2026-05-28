import './SignIn.css'

function SignUp() {
    return (
        <>
            <h1>Welcome to the Portal Sign in</h1>
            
            <form className='form-section' action='../services/user.services.js' method='post' autoComplete='on'>
                <div>
                    <label for='email'>Email Address: </label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        required
                        placeholder='johndoe@gmail.com'
                        autoComplete='username'
                    />    
                </div>

                <div>
                    <label for='password'>Password: </label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        required
                        autoComplete='current-password'
                    />
                </div>

                <div>
                    <input type='checkbox' id='remember-me' name='remember' />
                    <label for='remember-me'>Remember me for 30 days</label>
                </div>

                <button type='submit'>Sign In</button>
            </form>
            
        </>
    );
}

export default SignUp;