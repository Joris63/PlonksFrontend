import { useEffect, useRef, useState } from "react";
import "../../styles/common.scss";
import PasswordValidationBox from "./PasswordValidationBox";

const FormField = ({
  formName,
  field = {},
  handleChange,
  handleTouch,
  checkForWarning,
}) => {
  const [hidden, setHidden] = useState(field?.type === "password");
  const [warning, setWarning] = useState(() => checkForWarning(field));
  const [hintOpen, setHintOpen] = useState(false);

  const fieldRef = useRef(null);

  useEffect(() => {
    setWarning(checkForWarning(field));
  }, [field]);

  function handleFocus() {
    const validation =
      field?.minLength ||
      field?.maxLength ||
      field?.requiresLower ||
      field?.requiresUpper ||
      field?.requiresNr ||
      field?.requiresSymbol;

    if (field?.type === "password" && validation) {
      setHintOpen(true);
    }
  }

  function toggleHide() {
    setHidden(!hidden);
  }

  return (
    <div
      className={`form_field_wrapper form_input ${
        warning && field?.touched ? "error" : ""
      } ${field?.fullWidth ? "full_width" : ""}`}
    >
      <label
        className="form_field_label"
        htmlFor={`${formName}-field-input-${field?.name}`}
      >
        {field?.label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          ref={fieldRef}
          id={`${formName}-field-input-${field?.name}`}
          className="form_field"
          placeholder={field?.placeholder}
          type={
            field?.type !== "password" || (field?.type === "password" && hidden)
              ? field?.type
              : "text"
          }
          required={!field?.optional}
          value={field?.value}
          minLength={field?.minLength}
          maxLength={field?.maxLength}
          name={field?.name}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => {
            handleTouch(field?.name, true);
            setHintOpen(false);
          }}
        />
        <PasswordValidationBox
          open={hintOpen}
          field={field}
          anchor={fieldRef}
        />
        {field?.type === "password" && (
          <div
            className={`form_field_toggle_hide ${hidden ? "hidden" : ""}`}
            onClick={toggleHide}
          />
        )}
      </div>
      {((warning &&
        document.activeElement !== fieldRef.current &&
        field?.touched) ||
        field?.hint) && (
        <small className="form_field_hint">{warning || field?.hint}</small>
      )}
    </div>
  );
};

export default FormField;
