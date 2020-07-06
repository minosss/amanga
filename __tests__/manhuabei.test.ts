import amanga from '../source';

describe('manhuabei', () => {
	test('DrSTONE 113话', async () => {
		const manga = await amanga('https://www.manhuabei.com/manhua/DrSTONE/312653.html');

		expect(manga.title).toBe('Dr.STONE 石纪元');
		expect(manga.chapter).toBe('113话'), expect(manga.images).toHaveLength(20);
	});
});
