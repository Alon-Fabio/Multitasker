import React, { useReducer, useEffect } from "react";

const Register = ({ fetchProfile }) => {
  useEffect(() => {
    const cancelCourse = () => {
      document.getElementById("registerForm").reset();
    };
    cancelCourse();
  }, []);

  const formReducer = (registerData, action) => {
    // registerData === {name:string, email:string, password:string}
    // action === {type:"CHANGE_NAME" || "CHANGE_EMAIL" || "CHANGE_PASS", payload:string}
    const { type, payload } = action;

    switch (type) {
      case "CHANGE_NAME":
        return { ...registerData, name: payload };
      case "CHANGE_EMAIL":
        return { ...registerData, email: payload };
      case "CHANGE_PASS":
        return { ...registerData, password: payload };
      default:
        return new Error("FormReducer type is not valid");
    }
  };
  const [registerData, registerDispatch] = useReducer(formReducer, {
    email: "",
    password: "",
    name: "",
  });

  const saveAuthTokenInSessions = (token) => {
    window.sessionStorage.setItem("SmartBrainToken", token);
  };

  const onSubmitSignIn = (formData, event) => {
    event.preventDefault();
    fetch("http://localhost:3000/register", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          fetchProfile(data.token, data.userId);
          saveAuthTokenInSessions(data.token);
        }
      });
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <form id="registerForm" className="measure">
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Register</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">
                Name
              </label>
              <input
                className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="name"
                autoComplete="name"
                id="name"
                onChange={(event) => {
                  registerDispatch({
                    type: "CHANGE_NAME",
                    payload: event.target.value,
                  });
                }}
              />
            </div>
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
                onChange={(event) => {
                  registerDispatch({
                    type: "CHANGE_EMAIL",
                    payload: event.target.value,
                  });
                }}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                autoComplete="new-password"
                id="password"
                onChange={(event) => {
                  registerDispatch({
                    type: "CHANGE_PASS",
                    payload: event.target.value,
                  });
                }}
              />
            </div>
          </fieldset>
          <div className="">
            <input
              onClick={(event) => {
                onSubmitSignIn(registerData, event);
              }}
              className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Register"
            />
          </div>
        </form>
      </main>
    </article>
  );
};

export default Register;
