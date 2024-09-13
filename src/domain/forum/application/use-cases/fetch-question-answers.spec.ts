import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('fetch question answers', () => {
	beforeEach(() => {
		inMemoryAnswersRepository = new InMemoryAnswersRepository()
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
	})

	it('should be able to fetch recent question answers', async () => {
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-01') }),
		)
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-01') }),
		)
		await inMemoryAnswersRepository.create(
			makeAnswer({ questionId: new UniqueEntityId('question-01') }),
		)

		const { answers } = await sut.execute({
			questionId: 'question-01',
			page: 1,
		})

		expect(answers).toHaveLength(3)
	})

	it('should be able to fetch paginated recent question answers', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({ questionId: new UniqueEntityId('question-01') }),
			)
		}
		const { answers } = await sut.execute({
			questionId: 'question-01',
			page: 2,
		})
		expect(answers).toHaveLength(2)
	})
})