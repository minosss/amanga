import amanga from '../source';

describe('一直看漫画', () => {
	test('被召唤的贤者闯荡异世界 第13话', async () => {
		const manga = await amanga('https://www.yizhikan.com/chapter/204094');

		expect(manga.title).toBe('被召唤的贤者闯荡异世界/第13话');
		expect(manga.images).toHaveLength(44);
	});
});
