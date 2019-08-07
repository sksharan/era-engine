import React, {Component} from 'react';

class Register extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // TODO: Don't hack this
        // Hides canvas behind reigster page
        document.getElementById('canvas').setAttribute('style', 'z-index: -2;');
        return (
            <div>
                <h1>Register</h1>
                <div>
                    <form>
                        <div className='form-group'>
                            <label htmlFor='email'>Email address</label>
                            <input
                                type='email'
                                className='form-control'
                                id='exampleInputEmail1'
                                aria-describedby='emailHelp'
                                placeholder='Enter email'
                            ></input>
                            <small id='emailHelp' className='form-text text-muted'>
                                We will never share your email with anyone else.
                            </small>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='exampleInputPassword1'>Password</label>
                            <input
                                type='password'
                                className='form-control'
                                id='exampleInputPassword1'
                                placeholder='Password'
                            ></input>
                        </div>
                        <div className='form-group form-check'>
                            <input type='checkbox' className='form-check-input' id='exampleCheck1'></input>
                            <label className='form-check-label' htmlFor='exampleCheck1'>
                                Check me out
                            </label>
                        </div>
                        <button type='submit' className='btn btn-primary'>
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;
