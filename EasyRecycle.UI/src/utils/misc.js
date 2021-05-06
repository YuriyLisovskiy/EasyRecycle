export const getMessage = (data) => {
	if (data.hasOwnProperty('message')) {
		return data.message;
	}

	return data.toString();
}

export const getErrorMessage = (err) => {
	return (
		err && err.response && (
			(
				err.response.data && err.response.data.detail
			) || err.response.data || err.response.message
		)
	) || err.toString();
}

export const getOrDefault = (val, default_) => {
	return val === null || val === undefined ? default_ : val;
}

export const getClassForTag = (idx, length) => {
	let clsName;
	switch (idx) {
		case 0:
			clsName = "mr-1";
			break;
		case length - 1:
			clsName = "ml-1";
			break;
		default:
			clsName = "mx-1";
			break;
	}

	return clsName;
}

export const strIsEmpty = (str) => {
	return !str || str.length === 0;
}

export const emailIsValid = (email) => {
	return !strIsEmpty(email) && email.includes('@');
}

export const checkPassword = (password) => {
	if (!password || password.length < 8) {
		return 'Password must be at least 8 characters long.';
	}

	return undefined;
}

export const requiredFieldError = (field) => {
	if (strIsEmpty(field)) {
		return 'This field is required.';
	}

	return undefined;
}

export const roundFloat = (val, precision) => {
	precision = Math.max(precision, 1);
	let number = 1;
	while (precision > 0) {
		number *= 10;
		precision--;
	}

	return Math.round(val * number + Number.EPSILON) / number;
}

export const GarbageTypes = [
	{
		src: '/organic-waste-bin.png',
		value: 'OR'
	},
	{
		src: '/glass-waste-bin.png',
		value: 'GL'
	},
	{
		src: '/metal-waste-bin.png',
		value: 'ME'
	},
	{
		src: '/paper-waste-bin.png',
		value: 'PA'
	},
	{
		src: '/plastic-waste-bin.png',
		value: 'PL'
	}
];

export const GarbageTypeToIcon = {
	"OR": "/organic-waste-bin.png",
	"GL": "/glass-waste-bin.png",
	"ME": "/metal-waste-bin.png",
	"PA": "/paper-waste-bin.png",
	"PL": "/plastic-waste-bin.png",
};

let drawFillRect = (ctx, info, style = {}) => {
	const { x, y, w, h } = info;
	const { backgroundColor = 'black' } = style;
	ctx.beginPath();
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(x, y, w, h);
}

export const drawAvatar = (canvas, pixels, color, size) => {
	const canvasEle = canvas.current;
	canvasEle.width = size;
	canvasEle.height = size;
	let step = size / 5;
	let ctx = canvasEle.getContext("2d");
	let idx = 0;
	for (let x = 0; x < size; x += step) {
		for (let y = 0; y < size; y += step) {
			let pxVal = pixels[idx++];
			if (pxVal % 2 === 0) {
				drawFillRect(
					ctx,
					{x: x, y: y, w: step, h: step},
					{backgroundColor: color}
				);
			}
		}
	}
}

export const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const random_sequence = (min, max, n) => {
	let res = [];
	for (let i = 0; i < n; i++) {
		res.push(random(min, max));
	}

	return res;
}
