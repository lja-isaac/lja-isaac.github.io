const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
