const textInput = document.getElementById("inputText");
const fontInput = document.getElementById("fonts");
const fontSizeInput = document.getElementById("fontSize");
const fontSizeUnitsInput = document.getElementById("fontSizeUnits");
const colorInput = document.getElementById("color");
const saturationInput = document.getElementById("saturation");
const lightnessInput = document.getElementById("lightness");
const alphaInput = document.getElementById("alpha");

export const setListeners = () => {
	[
		textInput,
		fontInput,
		fontSizeInput,
		fontSizeUnitsInput,
		colorInput,
		saturationInput,
		lightnessInput,
		alphaInput,
	].forEach((elem) =>
		elem.addEventListener("input", ({ target }) => {
			const id = target.id;
			const value = target.value;
			document.getElementById(`${id}RangeValue`).innerHTML = value;
			if (value === target.max && target.id != "color") target.style.background = "#f87c56";
			else if (target.id != "color") target.style.background = "transparent";
		})
	);
	fontInput.addEventListener("keydown", (e) => {
		const value = e.target.value;
		const key = e.key;

		if (
			(key >= "0" && key <= "9" && value.length < 14) ||
			key == "Backspace" ||
			key == "Tab" ||
			key == "Enter" ||
			key == "Delete"
		) {
			e.target.value = value;
		} else {
			e.preventDefault();
			return false;
		}
	});

	fontInput.addEventListener("change", (e) => {
		if (!e.target.value) {
			e.target.value = 320;
		}
	});
};
