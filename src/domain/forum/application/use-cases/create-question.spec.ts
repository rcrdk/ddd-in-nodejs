import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('create question', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to create a question', async () => {
		const result = await sut.execute({
			authorId: 'author-01',
			title: 'Que dia é hoje?',
			content: 'Amnésia pura',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryQuestionsRepository.items.at(0)).toEqual(
			result.value?.question,
		)
	})
})
