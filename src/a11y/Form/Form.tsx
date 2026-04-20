import { useRef, useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  function validate() {
    const newErrors: Errors = {};

    if (!values.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!values.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(values.email)) {
        newErrors.email = "Enter a valid email address";
      }
    }

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsSubmitting(true);

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);

      // Focus error summary first
      errorSummaryRef.current?.focus();

      // Then focus first invalid field
      if (validationErrors.name) {
        nameRef.current?.focus();
        return;
      }

      if (validationErrors.email) {
        emailRef.current?.focus();
        return;
      }
    }

    // Success
    setSubmitted(true);
    setErrors({});
    setValues({ name: "", email: "" });
    setIsSubmitting(false);
  }

  function handleBlur(field: "name" | "email") {
    setErrors((prev) => {
      const newErrors = { ...prev };

      if (field === "name") {
        if (!values.name.trim()) {
          newErrors.name = "Name is required";
        } else {
          delete newErrors.name;
        }
      }

      if (field === "email") {
        if (!values.email.trim()) {
          newErrors.email = "Email is required";
        }
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(values.email)) {
          newErrors.email = "Enter a valid email address";
        } else {
          delete newErrors.email;
        }
      }

      return newErrors;
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      <h2>Contact Form</h2>

      {/* ERROR SUMMARY */}
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorSummaryRef}
          className={styles.errorSummary}
          role="alert"
          tabIndex={-1}
        >
          <p>Please fix the following errors:</p>
          <ul>
            {errors.name && <li>{errors.name}</li>}
            {errors.email && <li>{errors.email}</li>}
          </ul>
        </div>
      )}

      {/* NAME */}
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>

        <input
          ref={nameRef}
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => {
            setValues({ ...values, name: e.target.value });
            setSubmitted(false);
          }}
          onBlur={() => handleBlur("name")}
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
          ref={emailRef}
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => {
            setValues({ ...values, email: e.target.value });
            setSubmitted(false);
          }}
          onBlur={() => handleBlur("email")}
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
      <button type="submit" className={styles.button} disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {/* SUCCESS */}
      {submitted && (
        <p className={styles.success} aria-live="polite">
          Form submitted successfully!
        </p>
      )}
    </form>
  );
}
