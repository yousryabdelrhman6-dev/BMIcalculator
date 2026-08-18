// BMI category lookup table (WHO classification)
// Using a table instead of duplicated if/else ranges keeps the
// thresholds in one place and easy to update.
const BMI_CATEGORIES = [
  { max: 18.5, label: "Underweight", className: "underweight" },
  { max: 25, label: "Normal weight", className: "normal" },
  { max: 30, label: "Overweight", className: "overweight" },
  { max: Infinity, label: "Obese", className: "obese" },
];

function getCategory(bmi) {
  return BMI_CATEGORIES.find((c) => bmi < c.max);
}

// Validates a raw input string as a positive, finite number.
// Returns { valid: boolean, value: number, message: string }
function validatePositiveNumber(rawValue, fieldName) {
  const trimmed = rawValue.trim();

  if (trimmed === "") {
    return { valid: false, value: NaN, message: `${fieldName} is required.` };
  }

  const value = Number(trimmed);

  if (Number.isNaN(value)) {
    return { valid: false, value: NaN, message: `${fieldName} must be a number.` };
  }

  if (value <= 0) {
    return { valid: false, value: NaN, message: `${fieldName} must be greater than 0.` };
  }

  if (!Number.isFinite(value)) {
    return { valid: false, value: NaN, message: `${fieldName} is too large.` };
  }

  return { valid: true, value, message: "" };
}

function calculateBMI(heightCm, weightKg) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10; // round to 1 decimal place
}

function setFieldError(inputEl, errorEl, message) {
  if (message) {
    inputEl.classList.add("invalid");
    errorEl.textContent = message;
  } else {
    inputEl.classList.remove("invalid");
    errorEl.textContent = "";
  }
}

function positionMarker(bmi) {
  // Map BMI to a 0-100% position along the scale bar.
  // Scale is visually anchored: 15 -> 0%, 40 -> 100%, clamped.
  const min = 15;
  const max = 40;
  const clamped = Math.min(Math.max(bmi, min), max);
  const percent = ((clamped - min) / (max - min)) * 100;
  return percent;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bmi-form");
  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");
  const heightError = document.getElementById("height-error");
  const weightError = document.getElementById("weight-error");
  const resultSection = document.getElementById("result");
  const bmiNumberEl = document.getElementById("bmi-number");
  const bmiCategoryEl = document.getElementById("bmi-category");
  const scaleMarker = document.getElementById("scale-marker");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const heightCheck = validatePositiveNumber(heightInput.value, "Height");
    const weightCheck = validatePositiveNumber(weightInput.value, "Weight");

    setFieldError(heightInput, heightError, heightCheck.valid ? "" : heightCheck.message);
    setFieldError(weightInput, weightError, weightCheck.valid ? "" : weightCheck.message);

    if (!heightCheck.valid || !weightCheck.valid) {
      resultSection.hidden = true;
      return;
    }

    const bmi = calculateBMI(heightCheck.value, weightCheck.value);
    const category = getCategory(bmi);

    bmiNumberEl.textContent = bmi.toFixed(1);
    bmiCategoryEl.textContent = category.label;
    bmiCategoryEl.className = `category ${category.className}`;
    scaleMarker.style.left = `${positionMarker(bmi)}%`;

    resultSection.hidden = false;
  });

  // Clear error state as the user retypes
  [heightInput, weightInput].forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("invalid");
    });
  });
});