import React from "react";
import PropTypes from "prop-types";

const FormField = ({
  id,
  label,
  type,
  helpText,
  helpId,
  placeholder,
  value,
  onChangeInput,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        value={value}
        type={type}
        className="form-control"
        id={id}
        aria-describedby={helpId}
        placeholder={placeholder}
        onChange={onChangeInput}
      />
      {helpId && (
        <small id={helpId} className="form-text text-muted">
          {helpText}
        </small>
      )}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
};

FormField.defaultProps = {
  type: "number",
};

export default FormField;
