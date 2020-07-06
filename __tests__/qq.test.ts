import amanga from '../source';

describe('QQ', () => {
	test('海贼王 第195话', async () => {
		const manga = await amanga('https://ac.qq.com/ComicView/index/id/505430/cid/196');

		expect(manga.title).toBe('航海王');
		expect(manga.chapter).toBe('第195话 Mr.武士道');
		expect(manga.images).toHaveLength(22);
	});
});
