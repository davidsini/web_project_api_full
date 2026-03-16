import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import errorMessages from "@utils/errorMessages";
import Popup from "../Main/components/Popup/Popup";
import CurrentUserContext from '@contexts/CurrentUserContext.js';

const Register = ({ handleRegistration }) => {
  const [disabled, setDisabled] = useState(true);
  const [touchedFields, setTouchedFields] = useState({ email: false, password: false }); // Campos tocados
  const { 
    register, 
    handleSubmit, 
    setError, 
    clearErrors, 
    formState: { errors, isValid }, 
    trigger 
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      about: "",
      avatar: "",
    },
    mode: "onChange",
  });

  const { popup, handleMessagePopup, handleClosePopup } = useContext(CurrentUserContext);

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    setDisabled(!isValid);
  }, [isValid]);

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;

    setDisabled(hasErrors);
  }, [errors]);

  const handleValidation = (e) => {
    const input = e.target;
    const value = input.value.trim();
    let errorMessage = "";

    // Registrar que el campo fue "tocado"
    setTouchedFields((prev) => ({
      ...prev,
      [input.name]: true,
    }));

    if (input.type === "email" && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(value)) {
      errorMessage = errorMessages.email;
    } else if (
      input.type === "password" &&
      (value.length < 6 || value.length > 20)
    ) {
      errorMessage =
        value.length < 6
          ? errorMessages.minLengthPassword
          : errorMessages.maxLengthPassword;
    } else if (input.name === "name" && value !== "" && value.length < 2) {
      errorMessage = errorMessages.minLength;
    } else if (input.name === "about" && value !== "" && value.length < 2) {
      errorMessage = errorMessages.minLength;
    } else if (input.name === "avatar" && value !== "" && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value)) {
      errorMessage = errorMessages.url;
    }

    if (errorMessage) {
      setError(input.name, {
        type: "manual",
        message: errorMessage,
      });
    } else {
      clearErrors(input.name);
    }
  };

  const onSubmit = (data) => {
    handleMessagePopup();
    handleRegistration(data);
  };

  return (
    <div className="register">
      <p className="register__welcome">Regístrate</p>
      <form className="register__form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <label className="register__label">
          <input
            id="email"
            className={`register__form-input ${
              errors.email && touchedFields.email ? "register__form-input_error" : ""
            }`}
            name="email"
            type="email"
            placeholder="Correo electrónico"
            autoComplete="email"
            {...register("email", {
              required: errorMessages.required,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: errorMessages.email,
              },
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {touchedFields.email && errors.email && (
            <span className="register__error">{errors.email.message}</span>
          )}
        </label>

        <label className="register__label">
          <input
            id="password"
            className={`register__form-input ${
              errors.password && touchedFields.password ? "register__form-input_error" : ""
            }`}
            name="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            {...register("password", {
              required: errorMessages.required,
              minLength: {
                value: 6,
                message: errorMessages.minLengthPassword,
              },
              maxLength: {
                value: 20,
                message: errorMessages.maxLengthPassword,
              },
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {touchedFields.password && errors.password && (
            <span className="register__error">
              {errors.password.message}
            </span>
          )}
        </label>

        <label className="register__label">
          <input
            id="name"
            className={`register__form-input ${errors.name ? "register__form-input_error" : ""}`}
            name="name"
            type="text"
            placeholder="Nombre"
            {...register("name", {
              validate: (value) => value === "" || value.length >= 2 || errorMessages.minLength,
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {errors.name && <span className="register__error">{errors.name.message}</span>}
        </label>

        <label className="register__label">
          <input
            id="about"
            className={`register__form-input ${errors.about ? "register__form-input_error" : ""}`}
            name="about"
            type="text"
            placeholder="Ocupación"
            {...register("about", {
              validate: (value) => value === "" || value.length >= 2 || errorMessages.minLength,
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {errors.about && <span className="register__error">{errors.about.message}</span>}
        </label>

        <label className="register__label">
          <input
            id="avatar"
            className={`register__form-input ${errors.avatar ? "register__form-input_error" : ""}`}
            name="avatar"
            type="url"
            placeholder="URL de la imagen de perfil"
            {...register("avatar", {
              validate: (value) => value === "" || /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(value) || errorMessages.url,
            })}
            onInput={handleValidation}
            onBlur={handleValidation}
          />
          {errors.avatar && <span className="register__error">{errors.avatar.message}</span>}
        </label>

        <button
          type="submit"
          className={`register__link ${disabled ? "register__link_disabled" : ""}`}
          disabled={disabled}
        >
          Regístrate
        </button>
      </form>
      <div className="register__signin">
        <p>¿Ya eres miembro?</p>
        <Link to="login" className="register__login-link">
          Inicia sesión aquí
        </Link>
      </div>
      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title}>
          {popup.children}
        </Popup>
      )}
    </div>
  );
};

export default Register;
