import React, {Component} from 'react';

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img src='/main/img/login-background.jpg' className='account-background' />
                <div className='account-div'>
                    <form className='account-form'>
                        <p>
                            <input type='text' placeholder='username' />
                        </p>
                        <p>
                            <input type='password' placeholder='password' />
                        </p>
                        <p>
                            <input type='submit' value='login' />
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
