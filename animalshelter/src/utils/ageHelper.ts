export const getAgeString = (age: number): string => {
	if (age === 0) return 'Меньше года';

	const lastDigit = age % 10;
	const lastTwoDigits = age % 100;

	if (lastDigit === 1 && lastTwoDigits !== 11) {
		return `${age} год`;
	}

	if (
		lastDigit >= 2 &&
		lastDigit <= 4 &&
		!(lastTwoDigits >= 12 && lastTwoDigits <= 14)
	) {
		return `${age} года`;
	}

	return `${age} лет`;
};