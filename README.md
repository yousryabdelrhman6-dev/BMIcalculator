# BMI Calculator

A simple form where a user enters height (cm) and weight (kg) and instantly sees their BMI and category (underweight / normal / overweight / obese). Built with HTML5, CSS3, and vanilla JavaScript — no frameworks or build tools.


## How to Run Locally
1. Clone this repository.
2. Open `index.html` directly in your browser (no server or build step required).

## Approach

- **Structure**: A single card-style form with two number inputs (height, weight) and a Calculate button. Results (BMI value, category label, and a visual scale) are revealed below the form after a successful calculation.
- **Validation**: Before any calculation runs, both inputs are checked with a `validatePositiveNumber` helper that rejects empty fields, non-numeric input, zero/negative values, and non-finite numbers. Invalid fields are highlighted with an inline error message and the calculation is blocked — NaN or negative numbers never reach the BMI formula.
- **Category mapping**: Rather than duplicating BMI range checks with nested if/else, categories are defined once in a `BMI_CATEGORIES` lookup table (`{ max, label, className }`). `getCategory()` just finds the first bucket where `bmi < max`. This keeps the WHO thresholds in one place and easy to adjust.
- **Rounding**: BMI is rounded to 1 decimal place for readability (`Math.round(bmi * 10) / 10`).
- **Visual feedback**: A small horizontal scale bar shows the four categories, with a marker positioned proportionally to the calculated BMI, so the result is understandable at a glance and not just a raw number.

## Key Decisions

- Used a lookup table for BMI categories instead of duplicating range logic, per the task hints.
- Metric units only (cm/kg) to meet the minimum deliverable; see "Known Limitations" for how this could be extended.
- Kept the JS dependency-free so the project runs by simply opening `index.html` — nothing to install.

## Known Limitations

- **Imperial units are not supported.** The task only requires metric support at minimum, but interviewers may ask how to extend this — the answer is to add a unit toggle, convert inches/pounds to cm/kg before calculating (or use the imperial BMI formula directly: `703 × lb / in²`), and store the user's preferred unit.
- No persistence — refreshing the page clears the form and result.
- No automated tests; validation was checked manually with empty, negative, non-numeric, and valid inputs.

## Interview Question Notes

- **Validating positive numeric input**: convert with `Number()`, then check `Number.isNaN`, `value <= 0`, and `Number.isFinite` before using the value.
- **Supporting imperial units**: add a unit selector, then either convert inputs to metric first or branch the formula (`weight(lb) / height(in)² × 703`).
- **Mapping numeric ranges to labels cleanly**: an ordered lookup table of `{ max, label }` entries checked with `Array.find()`, rather than chained if/else.
