import React, { useState } from "react";
import PropTypes from "prop-types";

interface ISigProps {
  fetchProfile(token: string, id: number | null): void;
  onRouteChange(route: string): void;
  stage: string;
}

interface ISgnRedState {
  email: string;
  password: string;
}

const Signin: React.FC<ISigProps> = ({
  fetchProfile,
  onRouteChange,
  stage,
}) => {
  const [SigninErr, setSigninErr] = useState(false);
  const [password, setSigninPass] = useState("");
  const [email, setSigninEmail] = useState("");

  const saveAuthTokenInSessions = (token: string) => {
    window.sessionStorage.setItem("SmartBrainToken", token);
  };

  const onSubmitSignIn = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>,
    state?: ISgnRedState
  ) => {
    event.preventDefault();
    fetch(`https://${stage}/signin`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state && { email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.userId && data.success === "true") {
          saveAuthTokenInSessions(data.token);
          fetchProfile(data.token, data.userId);
          setSigninErr(false);
        }
        if (data === "signinAuthentication") {
          console.log(data, "Wrong pass or mail");
          setSigninErr(true);
        }
      })
      .catch(console.error);
  };

  return (
    <article className="tl br3 z-1 relative -1 ba b--black-10 mv4 h-auto w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4">
        <form className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email">
                Email
              </label>
              <input
                className="white pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                autoComplete="email"
                name="email"
                id="email"
                onChange={(event) => setSigninEmail(event.target.value)}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className="white b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                autoComplete="current-password"
                name="password"
                id="password"
                onChange={(event) => setSigninPass(event.target.value)}
              />
            </div>
            {SigninErr && <p className="error">Wrong info, please try again</p>}
          </fieldset>
          <div className="flex justify-between">
            <div className="">
              <input
                onClick={(event) => onSubmitSignIn(event)}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib input-signin"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="">
              <input
                onClick={(event) =>
                  onSubmitSignIn(event, {
                    email: "demo@alonfabio.com",
                    password: "Demo!2345",
                  })
                }
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib input-signin"
                type="submit"
                value="Demo"
              />
            </div>
          </div>
          <div className="lh-copy mt3">
            <p
              onClick={() => onRouteChange("register")}
              className="f6 link dim db pointer"
            >
              Register
            </p>
          </div>
        </form>
      </main>
    </article>
  );
};

Signin.propTypes = {
  fetchProfile: PropTypes.func.isRequired,
  onRouteChange: PropTypes.func.isRequired,
  stage: PropTypes.string.isRequired,
};

export default Signin;
