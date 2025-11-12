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
  container.className = "slider";

  const label = document.createElement("label");
  label.textContent = `${labelText}: ${initialValue}`;
  container.appendChild(label);

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = min.toString();
  slider.max = max.toString();
  slider.step = step.toString();
  slider.value = initialValue.toString();
  slider.addEventListener("input", () => {
    label.textContent = `${labelText}: ${slider.value}`;
    onChange(parseFloat(slider.value));
  });
  container.appendChild(label);
  container.appendChild(slider);
  parent.appendChild(container);
}
