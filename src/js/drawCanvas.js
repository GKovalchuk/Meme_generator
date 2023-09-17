import { setInputsValue } from "./changeCurElement.js";

export const drawCanvas = async () => {
	const image = document.getElementById("image");
	const canvas = document.getElementById("canvas");
	const newTextButton = document.getElementById("newText");
	const closeButton = document.getElementById("close");
	const textInput = document.getElementById("inputText");
	const fontInput = document.getElementById("fonts");
	const fontSizeInput = document.getElementById("fontSize");
	const fontSizeUnitsInput = document.getElementById("fontSizeUnits");
	const colorInput = document.getElementById("color");
	const saturationInput = document.getElementById("saturation");
	const lightnessInput = document.getElementById("lightness");
	const alphaInput = document.getElementById("alpha");

	// Переменные по умолчанию.
	let dragAllowed = false;
	let allCtx = [];
	let startX;
	let startY;
	let offsetX = 1;
	let offsetY = 1;
	let z = 0;
	let multH = 1;
	let multW = 1;
	let curElement = null;
	let oldCurElement = null;

	// Создаем контекст canvas.
	const context = await canvas.getContext("2d");
	// Задаем для canvas ширину и высоту.
	canvas.width = image.naturalWidth;
	canvas.height = image.naturalHeight;

	// Отображаем canvas.
	canvas.style.display = await "block";

	// Подгружаем картинку в canvas.
	context.drawImage(image, 0, 0);
	// Записываем множитель разницы размеров.
	multH = image.naturalHeight / document.getElementById("canvas").clientHeight;
	multW = image.naturalWidth / document.getElementById("canvas").clientWidth;
	offsetX = (document.getElementById("html").clientWidth - document.getElementById("placeholder").clientWidth) / 2;
	offsetY = document.getElementById("header").clientHeight;

	const newText = (x = 10 * multW, y = 10 * multH) => {
		let color = `hsla(${colorInput.value}, ${saturationInput.value}%, ${lightnessInput.value}%, ${alphaInput.value})`;
		let fontValue = fontInput.value;
		let fontSize = Number(fontSizeInput.value);
		let fontSizeUnits = fontSizeUnitsInput.value;
		dragAllowed = false;
		let text = textInput.value;

		// Создаем объект с параметрами текста.
		allCtx.push({
			color: colorInput.value,
			saturation: saturationInput.value,
			lightness: lightnessInput.value,
			alpha: alphaInput.value,
			fontValue: fontValue,
			fontSize: fontSize,
			fontSizeUnits: fontSizeUnits,
			text: text,
			// Выравнивание текста.
			textBaseline: "top",
			// Размер, единицы измерения размера и шрифт текста.
			font: `${fontSize}${fontSizeUnits} ${fontValue}`,
			// Цвет. colorText.value принимает значения от 0 до 360.
			fillStyle: color,
			// Содержание текста и его расположение относительно верхнего левого угла canvas.
			fillText: `${text}, ${x}, ${y})`,
			// Положение текста. z - "глубина"расположения текста.
			x: x,
			y: y,
			z: z,
			// Флаг, "true" во время перетаскивания.
			isDragging: false,
		});
		// Смена значения счетчика "глубины расположения" элемента.
		z += 1;
	};

	// Отрисовывем текст.
	function textRender(elem) {
		// Задаем параметры для текста.
		context.textBaseline = elem.textBaseline;
		context.font = elem.font;
		context.fillStyle = elem.fillStyle;
		// Задаем расположение текста и его содержание.
		context.fillText(elem.text, elem.x, elem.y);
		// Получаем и записываем размеры текста.
		let metrics = context.measureText(elem.text);
		elem.width = metrics.width;
		elem.height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
		context.width = elem.width * multW;
		context.height = elem.height * multH;
	}

	// Рендерим canvas.
	async function draw() {
		// Очищаем canvas.
		context.clearRect(0, 0, canvas.width, canvas.height);
		// Подгружаем картинку в canvas.
		await context.drawImage(image, 0, 0);
		// Записываем новые множители масштабирования canvas.
		multH = image.naturalHeight / document.getElementById("canvas").clientHeight;
		multW = image.naturalWidth / document.getElementById("canvas").clientWidth;
		// Отрисовываем все элементы с текстом.
		for (let i = 0; i < allCtx.length; i++) {
			textRender(allCtx[i]);
		}
	}

	function removeCanvasItems() {
		// Очищаем canvas.
		context.clearRect(0, 0, canvas.width, canvas.height);
		// Очищаем массив с данными.
		allCtx = [];
	}

	// Перетаскивание текста.
	const myMove = (e) => {
		// Проверка на возможность перемещения элемента.
		if (dragAllowed) {
			// Получаем текущее положение курсора.
			let curX = Number(e.clientX * multW - offsetX * multW);
			let curY = Number(e.clientY * multH - offsetY * multH);
			// Получаем смещение.
			let newX = curX - startX;
			let newY = curY - startY;

			// Проходим по массиву с текстами.
			allCtx.forEach((elem) => {
				if (elem.isDragging == true) {
					elem.x += newX;
					elem.y += newY;
				}
			});
			// Отрисовываем, задаем элементу новое расположение.
			draw();
			startX = curX;
			startY = curY;
		}
	};

	// Отпускание кнопки мыши. Переключаем флаги и останавливаем перетаскивание.
	const myUp = () => {
		dragAllowed = false;
		allCtx.forEach((elem) => (elem.isDragging = false));
	};

	// Нажатие кнопки мыши.
	const myDown = (e) => {
		// Получаем текущее положение курсора.
		let curX = parseInt(e.clientX * multW - offsetX * multW);
		let curY = parseInt(e.clientY * multH - offsetY * multH);

		// Переключаем флаг и создаем массив для элементов.
		dragAllowed = true;
		let curTextArr = [];
		// Проходим по массиву с текстами.
		allCtx.forEach((elem) => {
			// Проверяем, принадлежит ли элемент в текущему положению курсора.
			if (curX > elem.x && curX < elem.x + elem.width && curY > elem.y && curY < elem.y + elem.height) {
				// Если принадлежит - добавляем во временный массив.
				curTextArr.push(elem);
			}
		});

		// Если в массиве с текстами один элемент - разрешаем его перетаскивать.
		if (curTextArr.length === 1) {
			curTextArr[0].isDragging = true;
			curElement = curTextArr[0];
			/*
			Если в массиве с текстами больше одного элемента - выясняем, кто из них
			лежит "на меньшей глубине". Самый ближний разрешаем перетаскивать.
			*/
		} else if (curTextArr.length >= 2) {
			let maxZ = curTextArr[0].z;
			let b = curTextArr[0];

			curTextArr.forEach((elem) => {
				if (maxZ < elem.z) {
					maxZ = elem.z;
					b = elem;
					curElement = elem;
				}
			});
			b.isDragging = true;
		} else if (curTextArr.length === 0) {
			curElement = null;
		}
		startX = curX;
		startY = curY;

		if (curElement) {
			if (curElement !== oldCurElement && oldCurElement) draw();
			setInputsValue(curElement);
			context.strokeStyle = "#f87c56";
			context.lineWidth = 1 * multW;
			context.strokeRect(curElement.x, curElement.y, curElement.width, curElement.height);
			oldCurElement = curElement;
		} else {
			if (oldCurElement) draw();
			context.strokeRect(0, 0, 0, 0);
			oldCurElement = curElement;
		}
	};

	// Троттлинг для перемещения текста.
	function throttle(callee, timeout) {
		// Создаем таймер.
		let timer = null;

		return function perform(...args) {
			// Прекращение выполнения, если таймер уже существует.
			if (timer) return;

			// Запуск функции создает таймер.
			timer = setTimeout(() => {
				callee(...args);

				// По окончанию очищаем таймер.
				clearTimeout(timer);
				timer = null;
			}, timeout);
		};
	}
	// Троттлинг для перемещения текста.
	const moveWithThrottle = throttle((func, e) => {
		func(e);
	}, 30);

	const curElementMutator = ({ target }) => {
		if (!curElement) return;

		let id = target.id;
		let value = target.value;
		switch (id) {
			case "fonts": {
				curElement.fontValue = value;
				curElement.font = `${curElement.fontSize}${curElement.fontSizeUnits} ${value}`;
				break;
			}
			case "fontSize": {
				curElement.fontSize = value;
				curElement.font = `${value}${curElement.fontSizeUnits} ${curElement.fontValue}`;
				break;
			}
			case "fontSizeUnits": {
				curElement.fontSizeUnits = value;
				curElement.font = `${curElement.fontSize}${value} ${curElement.fontValue}`;
				break;
			}
			case "inputText": {
				curElement.text = value;
				curElement.fillText = `${value}, ${curElement.x}, ${curElement.y}`;
				break;
			}
			case "color": {
				curElement.color = value;
				curElement.fillStyle = `hsla(${value}, ${curElement.saturation}%, ${curElement.lightness}%, ${curElement.alpha}`;
				break;
			}
			case "saturation": {
				curElement.saturation = value;
				curElement.fillStyle = `hsla(${curElement.color}, ${value}%, ${curElement.lightness}%, ${curElement.alpha}`;
				break;
			}
			case "lightness": {
				curElement.lightness = value;
				curElement.fillStyle = `hsla(${curElement.color}, ${curElement.saturation}%, ${value}%, ${curElement.alpha}`;
				break;
			}
			case "alpha": {
				curElement.alpha = value;
				curElement.fillStyle = `hsla(${curElement.color}, ${curElement.saturation}%, ${curElement.lightness}%, ${value}`;
				break;
			}
		}
		draw();
	};

	const genNewText = () => {
		const abortGenNewText = async (e) => {
			newTextButton.textContent = "Создать текст";
			newTextButton.classList.remove("select-area__btn-attention");
			canvas.onmouseup = myUp;
			newTextButton.removeEventListener("click", abortGenNewText);
			newTextButton.addEventListener("click", genNewText);
		};
		const takeCoord = async (e) => {
			let curX = parseInt(e.clientX * multW - offsetX * multW);
			let curY = parseInt(e.clientY * multH - offsetY * multH);
			await newText(curX, curY);
			draw();
			abortGenNewText();
		};
		curElement = null;
		newTextButton.textContent = "Выберите место";
		newTextButton.classList.add("select-area__btn-attention");
		newTextButton.removeEventListener("click", genNewText);

		newTextButton.addEventListener("click", abortGenNewText);
		canvas.onmouseup = takeCoord;
	};

	// Назначаем событиям функции.
	newTextButton.addEventListener("click", genNewText);
	[
		textInput,
		fontInput,
		fontSizeInput,
		fontSizeUnitsInput,
		colorInput,
		saturationInput,
		lightnessInput,
		alphaInput,
	].forEach((elem) => elem.addEventListener("input", curElementMutator));
	closeButton.addEventListener("click", removeCanvasItems);
	canvas.onmousedown = myDown;
	canvas.onmouseup = myUp;
	canvas.onmousemove = (e) => moveWithThrottle(myMove, e);

	draw();
};
