import React, { useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

interface IInputs {
  email: string;
  password: string;
  name: string;
}

const Register: React.FC<{
  fetchProfile(token: string, id: number | null): void;
}> = ({ fetchProfile }) => {
  useEffect(() => {
    const cancelCourse = () => {
      (document.getElementById("registerForm") as HTMLFormElement).reset();
    };
    cancelCourse();
  }, []);

  const { register, handleSubmit, watch, errors } = useForm<IInputs>();

  const saveAuthTokenInSessions = (token: string): void => {
    window.sessionStorage.setItem("SmartBrainToken", token);
  };

  const onSubmitSignIn = (formData: IInputs) => {
    // Enter validation here
    console.log(formData);
    if (formData.password !== "" && formData.email !== "") {
      // fetch("http://13.49.244.213/register", {
      fetch("http://localhost/register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log("Fetch data: ", data);
            fetchProfile(data.token, data.userId);
            saveAuthTokenInSessions(data.token);
          }
        });
      console.log(formData);
    }
  };

  return (
    <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4 black-80">
        <form
          id="registerForm"
          className="measure"
          onSubmit={handleSubmit(onSubmitSignIn)}
        >
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
                pattern="(?=.*[a-z])(?=.*[A-Z]).{2,}"
                title="Must contain at least one uppercase and lowercase letter, and at least 2 characters long."
                ref={register({
                  required: true,
                  pattern: /[a-z][A-Z]/,
                })}
              />
            </div>
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
                ref={register({ required: true })}
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
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}"
                title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 characters long."
                ref={register({ required: true })}
              />
            </div>
          </fieldset>
          <div className="">
            <input
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

Register.propTypes = {
  fetchProfile: PropTypes.func.isRequired,
};

export default Register;
