import React from 'react';

export function Register() {
  return (
    <div>
      <div className="account-div">
        <form className="account-form">
          <p>
            <input type="text" placeholder="username" />
          </p>
          <p>
            <input type="password" placeholder="password" />
          </p>
          <p>
            <input type="password" placeholder="confirm password" />
          </p>
          <p>
            <input type="email" placeholder="email" />
          </p>
          <p>
            <input type="submit" value="register" />
          </p>
        </form>
      </div>
    </div>
  );
}
