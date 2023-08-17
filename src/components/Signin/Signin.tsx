import React, { useReducer, useState } from "react";
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
interface ISigRedAction {
  type: "CHANGE_PASS" | "CHANGE_EMAIL";
  payload: string;
}

const Signin: React.FC<ISigProps> = ({
  fetchProfile,
  onRouteChange,
  stage,
}) => {
  const [SigninErr, setSigninErr] = useState(false);

  const signInReducer = (
    signInState: ISgnRedState,
    { type, payload }: ISigRedAction
  ): ISgnRedState => {
    // signInState === {signInEmail: string,signInPassword:string}
    // action === {type: "CHANGE_EMAIL" || "CHANGE_PASS", payload:string}

    switch (type) {
      case "CHANGE_EMAIL":
        return { ...signInState, email: payload };
      case "CHANGE_PASS":
        return { ...signInState, password: payload };
      default:
        console.error(new Error("FormReducer type is not valid"));
        return signInState;
    }
  };
  const [signInState, signInDispatch] = useReducer(signInReducer, {
    email: "",
    password: "",
  });

  const saveAuthTokenInSessions = (token: string) => {
    window.sessionStorage.setItem("SmartBrainToken", token);
  };

  const onSubmitSignIn = (
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    event.preventDefault();
    fetch(`https://${stage}/signin`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signInState),
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
      .catch(console.log);
  };

  return (
    <article className="br3 z-1 relative -1 ba b--black-10 mv4 h-auto w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4">
        <form className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="email">
                Email
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                autoComplete="email"
                name="email"
                id="email"
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
            {SigninErr && <p className="error">Wrong info, please try again</p>}
          </fieldset>
          <div className="">
            <input
              onClick={(event) => onSubmitSignIn(event)}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib input-signin"
              type="submit"
              value="Sign in"
            />
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
