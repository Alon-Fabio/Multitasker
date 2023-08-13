import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

interface IInputs {
  email: string;
  password: string;
  name: string;
}

const Register: React.FC<{
  fetchProfile(token: string, id: number | null): void;
  stage: string;
}> = ({ fetchProfile, stage }) => {
  useEffect(() => {
    const cancelCourse = () => {
      (document.getElementById("registerForm") as HTMLFormElement).reset();
    };
    cancelCourse();
  }, []);

  const { register, handleSubmit } = useForm<IInputs>();

  const saveAuthTokenInSessions = (token: string): void => {
    window.sessionStorage.setItem("SmartBrainToken", token);
  };

  const onSubmitSignIn = (formData: IInputs) => {
    // Enter validation here
    if (formData.password !== "" && formData.email !== "") {
      fetch(`http://${stage}/register`, {
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
    }
  };

  return (
    <article className="z-1 relative br3 ba b--black-10 mv4 h-auto w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4">
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
                  pattern: /(?=.*[a-z])(?=.*[A-Z])/i,
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
          <div>
            <input
              className="ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib input-register"
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
  stage: PropTypes.string.isRequired,
};

export default Register;
