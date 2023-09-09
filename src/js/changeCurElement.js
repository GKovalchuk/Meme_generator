const inputText = document.getElementById("inputText");
const font = document.getElementById("fonts");
const fontSizeInput = document.getElementById("fontSize");
const fontSizeUnitsInput = document.getElementById("fontSizeUnits");
const colorText = document.getElementById("color");
const saturationText = document.getElementById("saturation");
const lightnessText = document.getElementById("lightness");
const alphaText = document.getElementById("alpha");

export const setInputsValue = (elem) => {
	if (!elem) return;
	const { text, fontValue, fontSize, fontSizeUnits, color, saturation, lightness, alpha } = elem;
	inputText.value = text;
	font.value = fontValue;
	fontSizeInput.value = fontSize;
	fontSizeUnitsInput.value = fontSizeUnits;
	colorText.value = color;
	saturationText.value = saturation;
	lightnessText.value = lightness;
	alphaText.value = alpha;
};
