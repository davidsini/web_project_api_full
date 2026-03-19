import { useEffect, useState, useCallback } from "react";

const useFormValidation = (config, formRef) => {
  const [inputList, setInputList] = useState([]);
  const [buttonElement, setButtonElement] = useState(null);
  const [errors, setErrors] = useState({});
  const [isReady, setIsReady] = useState(false);

  // 1. Funciones de error envueltas en useCallback
  const showInputError = useCallback(
    (inputElement, errorMessage) => {
      if (inputElement && inputElement.id && formRef.current) {
        const errorElement = formRef.current.querySelector(
          `.${inputElement.id}-error`,
        );
        if (errorElement) {
          inputElement.classList.add(config.inputErrorClass);
          setErrors((state) => ({ ...state, [inputElement.id]: errorMessage }));
          errorElement.textContent = errorMessage;
          errorElement.classList.add(config.errorClass);
        }
      }
    },
    [config, formRef],
  );

  const hideInputError = useCallback(
    (inputElement) => {
      if (inputElement && inputElement.id && formRef.current) {
        const errorElement = formRef.current.querySelector(
          `.${inputElement.id}-error`,
        );
        if (errorElement) {
          inputElement.classList.remove(config.inputErrorClass);
          setErrors((state) => ({ ...state, [inputElement.id]: "" }));
          errorElement.classList.remove(config.errorClass);
          errorElement.textContent = "";
        }
      }
    },
    [config, formRef],
  );

  // 2. Lógica de validación
  const checkInputValidity = useCallback(
    (inputElement) => {
      if (inputElement) {
        if (!inputElement.validity.valid) {
          showInputError(inputElement, inputElement.validationMessage);
        } else {
          hideInputError(inputElement);
        }
      }
    },
    [showInputError, hideInputError],
  );

  const hasInvalidInput = useCallback(() => {
    return inputList.some((inputElement) => !inputElement.validity.valid);
  }, [inputList]);

  const toggleButtonState = useCallback(() => {
    if (buttonElement) {
      if (hasInvalidInput()) {
        buttonElement.classList.add(config.inactiveButtonClass);
        buttonElement.setAttribute("disabled", "");
      } else {
        buttonElement.classList.remove(config.inactiveButtonClass);
        buttonElement.removeAttribute("disabled");
      }
    }
  }, [buttonElement, hasInvalidInput, config]);

  // 3. EFECTO DE INICIALIZACIÓN
  useEffect(() => {
    const form = formRef.current;
    if (form) {
      setInputList(Array.from(form.querySelectorAll(config.inputSelector)));
      setButtonElement(form.querySelector(config.submitButtonSelector));
    }
  }, [config, formRef]);

  // 4. Event Listeners
  useEffect(() => {
    const handleInput = (event) => {
      checkInputValidity(event.target);
      toggleButtonState();
    };

    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", handleInput);
    });

    if (inputList.length > 0) setIsReady(true);

    return () => {
      inputList.forEach((inputElement) => {
        inputElement.removeEventListener("input", handleInput);
      });
    };
  }, [inputList, checkInputValidity, toggleButtonState]);

  const resetValidation = () => {
    inputList.forEach((inputElement) => {
      hideInputError(inputElement);
    });
    toggleButtonState();
  };

  return { resetValidation, errors, isReady };
};

export default useFormValidation;
