const downloadButton = document.getElementById("download");
const canvas = document.getElementById("canvas");

// Сохраняем изображение из canvas.
const downloadImg = async () => {
	// Создаем элемент ссылки.
	let link = document.createElement("a");
	// Создаем атрибут download.
	link.download = "MEME.png";
	// Создаем файл с данными.
	let blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
	// Создаем путь, подключаем его в ссылку.
	link.href = URL.createObjectURL(blob);
	// Нажимаем на ссылку.
	link.click();

	// Удаляем ссылку на Blob, очищаем память.
	URL.revokeObjectURL(link.href);
};

export const download = () => {
	downloadButton.addEventListener("click", downloadImg);
};
