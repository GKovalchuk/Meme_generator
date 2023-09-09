import { download } from "./download.js";
import { drawCanvas } from "./drawCanvas.js";

const input = document.getElementById("input");
const image = document.getElementById("image");
const canvas = document.getElementById("canvas");
const closeButton = document.getElementById("close");
const downloadButton = document.getElementById("download");
const newTextButton = document.getElementById("newText");
const spanClickToSelect = document.getElementById("spanClickToSelect");
const loadingSpinner = document.getElementById("loadingSpinner");

// Функция, считывающая файл.
const fileToDataUrl = (file) => {
	// Cоздаем промис.
	return new Promise((resolve, reject) => {
		// Cоздаем новый объект FileReader.
		const fileReader = new FileReader();
		// Если успешно.
		fileReader.addEventListener("load", (evt) => {
			resolve(evt.currentTarget.result);
		});
		// Обрабатываем ошибки.
		fileReader.addEventListener("error", (evt) => {
			reject(new Error(evt.currentTarget.error));
		});

		// Возвращаем данные из файлридера.
		fileReader.readAsDataURL(file);
	});
};

// Функция, подгужающая картинку.
const handleSelect = async (evt) => {
	input.setAttribute("disabled", "");
	input.style.display = "none";
	// Скрываем спан-плейсхолдер.
	spanClickToSelect.hidden = true;
	// Отображаем лоадер.
	loadingSpinner.hidden = false;

	const files = [...evt.target.files];
	const newUrl = await Promise.all(files.map((o) => fileToDataUrl(o)));
	if (newUrl.length > 0) {
		// Присваиваем данные в картинку.
		image.src = await newUrl;
		// image.style.display = await "block";
		// Запускаем рендеринг canvas.
		drawCanvas();
		// Скрываем лоадер.
		loadingSpinner.hidden = true;
		// Включаем прослушиватели для кнопок.
		closeButton.addEventListener("click", removeItem);
		// Скрываем лоадер.
		downloadButton.removeAttribute("disabled");
		newTextButton.removeAttribute("disabled");
		download();
	}
};

const removeItem = () => {
	// Очищаем картинку.
	image.src = "";
	// Скрываем canvas.
	canvas.style.display = "none";
	// Отображаем спан-плейсхолдер.
	spanClickToSelect.hidden = false;
	// Включаем инпут файлов.
	input.removeAttribute("disabled");
	input.style.display = "inline-block";
	downloadButton.setAttribute("disabled", "");
	newTextButton.setAttribute("disabled", "");
};

// Включаем инпут файлов
export const scriptsSelectArea = () => {
	input.addEventListener("change", handleSelect);
};
