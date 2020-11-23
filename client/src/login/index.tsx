import React from 'react';

export function Login() {
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
            <input type="submit" value="login" />
          </p>
        </form>
      </div>
    </div>
  );
}
