import { Slug } from './slug'

it('should be able to create a new slug from text', async () => {
	const slug = Slug.createFromText('Example question title not in Português!')

	expect(slug.value).toEqual('example-question-title-not-in-portugues')
})
