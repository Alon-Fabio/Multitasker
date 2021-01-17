import React, { useReducer } from "react";
import PropTypes from "prop-types";

const Signin = ({ fetchProfile, onRouteChange }) => {
  const signInReducer = (signInState, { type, payload }) => {
    // signInState === {signInEmail: string,signInPassword:string}
    // action === {type: "CHANGE_EMAIL" || "CHANGE_PASS", payload:string}

    switch (type) {
      case "CHANGE_EMAIL":
        return { ...signInState, email: payload };
      case "CHANGE_PASS":
        return { ...signInState, password: payload };
      default:
        return new Error("FormReducer type is not valid");
    }
  };
  const [signInState, signInDispatch] = useReducer(signInReducer, {
    email: "",
    password: "",
  });

  const saveAuthTokenInSessions = (token) => {
    window.sessionStorage.setItem("SmartBrainToken", token);
  };

  const onSubmitSignIn = (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signInState),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.userId && data.success === "true") {
          saveAuthTokenInSessions(data.token);
          fetchProfile(data.token, data.userId);
        }
      })
      .catch(console.log);
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <form className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email-address">
                Email
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                autoComplete="email"
                name="email-address"
                id="email-address"
                onChange={(event) =>
                  signInDispatch({
                    type: "CHANGE_EMAIL",
                    payload: event.target.value,
                  })
                }
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                autoComplete="current-password"
                suggested="current-password"
                name="password"
                id="password"
                onChange={(event) =>
                  signInDispatch({
                    type: "CHANGE_PASS",
                    payload: event.target.value,
                  })
                }
              />
            </div>
          </fieldset>
          <div className="">
            <input
              onClick={(event) => onSubmitSignIn(event)}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Sign in"
            />
          </div>
          <div className="lh-copy mt3">
            <p
              onClick={() => onRouteChange("register")}
              className="f6 link dim black db pointer"
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
};

export default Signin;
