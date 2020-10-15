import React from "react";

const FormStructure = ({
  submitText,
  formComponent,
  btnClass,
  formBorderColor,
  submitForm,
}) => {
  return (
    <div className={"bg-light card-body rounded-sm " + formBorderColor}>
      <form onSubmit={submitForm}>
        {formComponent}
        <button className={"btn btn-outline-" + btnClass} type="submit">
          {submitText}
        </button>
      </form>
    </div>
  );
};

export default FormStructure;
