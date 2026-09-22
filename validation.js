// North Star Bakery - Contact form validation (Touchstone 4)
// Validates the pre-order/inquiry form with JavaScript, shows feedback
// next to each invalid field, and blocks submission until everything
// passes. Valid submissions show a confirmation message instead of
// actually sending anywhere, since this is a client-side demo form.

// Each validator function takes the field's current value and returns
// an error message string, or an empty string if the value is valid.
const fieldValidators = {
  name: function (value) {
    if (value.trim().length < 2) {
      return "Please enter your full name (at least 2 characters).";
    }
    return "";
  },
  email: function (value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim())) {
      return "Please enter a valid email address, like name@example.com.";
    }
    return "";
  },
  "pickup-date": function (value) {
    if (!value) {
      return "Please choose a pickup date.";
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosenDate = new Date(value + "T00:00:00");
    if (chosenDate < today) {
      return "Pickup date cannot be in the past.";
    }
    return "";
  },
  "item-details": function (value) {
    if (value.trim().length < 5) {
      return "Please tell us a little more about what you'd like to order.";
    }
    return "";
  },
};

// Shows or clears the error message for one field.
function setFieldError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + "-error");
  if (!errorEl) {
    return;
  }
  errorEl.textContent = message;
}

// Runs the matching validator for one field and displays its result.
// Returns true if the field is valid.
function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const validator = fieldValidators[fieldId];
  if (!field || !validator) {
    return true;
  }
  const message = validator(field.value);
  setFieldError(fieldId, message);
  return message === "";
}

// Runs every registered validator and returns true only if all fields
// pass. Displays every failing message at once so the user can fix
// everything in one pass instead of one error at a time.
function validateForm() {
  const fieldIds = Object.keys(fieldValidators);
  const results = fieldIds.map(validateField);
  return results.every(function (isValid) {
    return isValid;
  });
}

// Clears a field's error as soon as the user starts fixing it, so
// feedback does not linger after the problem is corrected.
function attachLiveValidation() {
  const fieldIds = Object.keys(fieldValidators);
  fieldIds.forEach(function (fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) {
      return;
    }
    field.addEventListener("input", function () {
      validateField(fieldId);
    });
  });
}

// Handles the actual submit event: prevents the default page reload,
// validates every field, and either shows a success message or leaves
// the entered values in place so the user can fix and resubmit.
function handleContactSubmit(event) {
  event.preventDefault();
  const isValid = validateForm();
  const form = event.target;

  let statusEl = document.getElementById("form-status");
  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.id = "form-status";
    statusEl.setAttribute("aria-live", "polite");
    form.insertBefore(statusEl, form.firstChild);
  }

  if (isValid) {
    statusEl.textContent = "Thanks! Your request looks good and is ready to send.";
    statusEl.style.color = "#2F2A26";
  } else {
    statusEl.textContent = "Please fix the highlighted fields before submitting.";
    statusEl.style.color = "#b3261e";
  }
}

function initContactValidation() {
  const form = document.getElementById("contact-form");
  if (!form) {
    return;
  }
  attachLiveValidation();
  form.addEventListener("submit", handleContactSubmit);
}

document.addEventListener("DOMContentLoaded", initContactValidation);
