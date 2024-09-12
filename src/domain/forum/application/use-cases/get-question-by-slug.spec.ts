import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('get question by slug', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to get a question by slug', async () => {
		const newQuestion = makeQuestion()

		await inMemoryQuestionsRepository.create(newQuestion)

		const { question } = await sut.execute({
			slug: 'example-question-01',
		})

		expect(question.id).toBeTruthy()
		expect(inMemoryQuestionsRepository.items.at(0)?.slug).toEqual(
			newQuestion.slug,
		)
	})
})
