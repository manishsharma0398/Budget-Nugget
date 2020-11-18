import React from "react";

const FormStructure = ({
  formComponent,
  formBorderColor,
  submitFormFunc,
  formId,
  primaryBtnId,
  primaryBtnClass,
  primaryBtnText,
  cancelBtnId,
  cancelBtnFunc,
  showCancelBtn,
}) => {
  return (
    <div className={"bg-light card-body rounded-sm " + formBorderColor}>
      <form id={formId} onSubmit={submitFormFunc}>
        {formComponent}
        <button
          id={primaryBtnId}
          className={"mr-3 btn btn-outline-" + primaryBtnClass}
          type="submit"
        >
          {primaryBtnText}
        </button>
        {showCancelBtn && (
          <button
            id={cancelBtnId}
            onClick={cancelBtnFunc}
            className={"btn btn-outline-primary"}
            type="button"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default FormStructure;
