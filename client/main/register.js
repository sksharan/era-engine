import React, {Component} from 'react';

class Register extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <img src='/main/img/register-background.jpg' className='account-background' />
                <div className='account-div'>
                    <form className='account-form'>
                        <p>
                            <input type='text' placeholder='username' />
                        </p>
                        <p>
                            <input type='password' placeholder='password' />
                        </p>
                        <p>
                            <input type='password' placeholder='confirm password' />
                        </p>
                        <p>
                            <input type='email' placeholder='email' />
                        </p>
                        <p>
                            <input type='submit' value='register' />
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;
