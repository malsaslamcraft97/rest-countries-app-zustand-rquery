import { useState } from "react";
import styles from "./Form.module.scss";

type Errors = {
  name?: string;
  email?: string;
};

export function Form() {
  const [values, setValues] = useState({
    name: "",
    email: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const newErrors: Errors = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!values.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <h2>Contact Form</h2>

      {/* NAME */}
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>

        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={styles.input}
        />

        {errors.name && (
          <p id="name-error" className={styles.error}>
            {errors.name}
          </p>
        )}
      </div>

      {/* EMAIL */}
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>

        <input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={styles.input}
        />

        {errors.email && (
          <p id="email-error" className={styles.error}>
            {errors.email}
          </p>
        )}
      </div>

      {/* SUBMIT */}
      <button type="submit" className={styles.button}>
        Submit
      </button>

      {/* SUCCESS MESSAGE */}
      {submitted && (
        <p className={styles.success} aria-live="polite">
          Form submitted successfully!
        </p>
      )}
    </form>
  );
}
