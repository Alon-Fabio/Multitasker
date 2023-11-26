import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

interface FormValues {
  email: string;
  password: string;
  name: string;
}

const Register: React.FC<{
  fetchProfile(token: string, id: number | null): void;
  onRouteChange(route: string): void;
  stage: string;
}> = ({ fetchProfile, onRouteChange, stage }) => {
  useEffect(() => {
    const cancelCourse = () => {
      (document.getElementById("registerForm") as HTMLFormElement).reset();
    };
    cancelCourse();
  }, []);

  const { register, handleSubmit } = useForm<FormValues>();

  const saveAuthTokenInSessions = (token: string): void => {
    window.sessionStorage.setItem("SmartBrainToken", token);
  };
  const onSubmitSignIn = (formData: FormValues) => {
    // Enter validation here
    if (formData.password !== "" && formData.email !== "") {
      fetch(`${stage}/register`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success === true) {
            console.log("You're logged in.");
            fetchProfile(data.token, data.userId);
            saveAuthTokenInSessions(data.token);
            onRouteChange("home");
          }
        })
        .catch(console.error);
    }
  };
  const onSub = handleSubmit((formValues) => onSubmitSignIn(formValues));

  return (
    <article className="tl z-1 relative br3 ba b--black-10 mv4 h-auto w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main className="pa4">
        <form id="registerForm" className="measure" onSubmit={onSub}>
          <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
            <legend className="f1 fw6 ph0 mh0">Register</legend>
            <div className="mt3">
              <label className="db fw6 lh-copy f6" htmlFor="name">
                Name
              </label>
              <input
                className="white pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                autoComplete="name"
                id="name"
                pattern="(?=.*[a-z])(?=.*[A-Z]).{2,}"
                title="Must contain at least one uppercase and lowercase letter, and at least 2 characters long."
                {...register("name", {
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
                className="white pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                autoComplete="email"
                id="email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="mv3">
              <label className="db fw6 lh-copy f6" htmlFor="password">
                Password
              </label>
              <input
                className="white b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                autoComplete="new-password"
                id="password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}"
                title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 characters long."
                {...register("password", { required: true })}
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
          <div className="lh-copy mt3">
            <p
              onClick={() => onRouteChange("signin")}
              className="f6 link dim db pointer"
            >
              Sign in
            </p>
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
