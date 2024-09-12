import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('answer question', () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
	})

	it('should be able to create an question', async () => {
		const { answer } = await sut.execute({
			content: 'Que dia é hoje?',
			authorId: 'instructor-01',
			questionId: 'question-01',
		})

		expect(answer.id).toBeTruthy()
		expect(inMemoryAnswersRepository.items.at(0)?.id).toEqual(answer.id)
	})
})
