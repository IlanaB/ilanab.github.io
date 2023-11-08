"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
	var svgns = "http://www.w3.org/2000/svg";
	var colorOptions = ["777", "999", "3F4845"];

	var getRandomNumber = function getRandomNumber(start, end) {
		return Math.floor(Math.random() * (end - start)) + start;
	};

	var makeTriangle = function makeTriangle(attributes) {
		var shape = document.createElementNS(svgns, "polygon");
		shape.setAttributeNS(null, "points", attributes.points);
		shape.setAttributeNS(null, "fill", attributes.shade);

		return shape;
	};

	var getConfettiCount = function getConfettiCount(screen) {
		// 1 confetti per ~6000px area give or take 15
		var randomizer = getRandomNumber(-15, 15);
		var count = screen[0] * screen[1] / (6000 + randomizer);
		return Math.round(count);
	};

	var applyTransform = function applyTransform(element, transform) {
		element.style.transform = transform;
		element.style.webkitTransform = transform;
		element.style.msTransform = transform;
	};

	var setSvgAttributes = function setSvgAttributes(svg, attributes, startPos, offsetTop) {
		var transitionDuration = getRandomNumber(10, 30) / 10;

		svg.setAttribute("class", "confetti");
		svg.setAttribute("width", attributes.size);
		svg.setAttribute("height", attributes.size);

		var distanceLeft = startPos[0];
		var distanceTop = attributes.size + offsetTop;

		svg.style.transitionDuration = transitionDuration + "s";
		svg.style.transformOrigin = "50% 50% 0";
		svg.style.left = distanceLeft + "px";
		svg.style.top = "-" + distanceTop + "px";
	};

	var createConfettiItem = function createConfettiItem(startPos, screenHeight) {
		var attributes = getRandomAttributes();
		var triangle = makeTriangle(attributes);
		var offsetTop = 5 + getRandomNumber(0, screenHeight / 2);

		var svg = document.createElementNS(svgns, "svg");

		setSvgAttributes(svg, attributes, startPos, offsetTop);
		svg.appendChild(triangle);
		svg.addEventListener("transitionend", destroyConfettiElement, false);

		// the transition won't work if applied immediately
		// TODO - find a better way than setTimeout()
		setTimeout(function () {
			var distanceLeft = getRandomNumber(-100, 250);
			var distanceTop = screenHeight + attributes.size + offsetTop;
			applyTransform(svg, "translate(" + distanceLeft + "px, " + distanceTop + "px) translateZ(0) rotate(" + attributes.rotationStart + "deg)");
		}, 10);

		return svg;
	};

	var getTrianglePoints = function getTrianglePoints(size) {
		return size / 2 + "," + size / 4 + " " + size * 0.75 + "," + size * 0.75 + " " + size / 4 + "," + size * 0.75;
	};

	var getRandomAttributes = function getRandomAttributes() {
		var size = 20 + getRandomNumber(0, 8);
		var selectedColor = colorOptions[getRandomNumber(0, colorOptions.length)];

		return _defineProperty({
			points: getTrianglePoints(size),
			shade: "#000",
			size: size,
			rotationStart: getRandomNumber(180, 1440)
		}, "shade", "#" + selectedColor);
	};

	var destroyConfettiElement = function destroyConfettiElement(e) {
		var parent = e.currentTarget.parentElement ? e.currentTarget.parentElement : e.currentTarget.parentNode;
		parent.removeChild(e.currentTarget);
	};

	var doConfetti = function doConfetti() {
		var screenSize = [window.innerWidth, window.innerHeight];

		var count = getConfettiCount(screenSize);
		var startPos = [0, 0];
		var container = document.getElementById("confetti-container");

		for (count; count > 0; count--) {
			startPos = [getRandomNumber(0, screenSize[0]), 0];
			var el = createConfettiItem(startPos, screenSize[1]);
			container.appendChild(el);
		}
	};

	window.doConfetti = doConfetti;
})();