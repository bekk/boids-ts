export function createSlider(
  parent: HTMLElement,
  labelText: string,
  min: number,
  max: number,
  step: number,
  initialValue: number,
  onChange: (value: number) => void
) {
  const container = document.createElement("div");
  container.style.marginBottom = "10px";

  const label = document.createElement("label");
  label.textContent = `${labelText}: ${initialValue}`;
  label.style.marginRight = "10px";
  label.style.gridColumn = "1 / 3";
  container.appendChild(label);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = min.toString();
  slider.max = max.toString();
  slider.style.gridColumn = "1 / 3";
  slider.step = step.toString();
  slider.value = initialValue.toString();
  slider.style.width = "200px";
  slider.addEventListener("input", () => {
    label.textContent = `${labelText}: ${slider.value}`;
    onChange(parseFloat(slider.value));
  });
  parent.appendChild(label);
  parent.appendChild(slider);
}
