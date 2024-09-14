import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionAnswersUseCase } from './fetch-question-answers'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('fetch question answers', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
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

		const result = await sut.execute({
			questionId: 'question-01',
			page: 1,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.answers).toHaveLength(3)
	})

	it('should be able to fetch paginated recent question answers', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswersRepository.create(
				makeAnswer({ questionId: new UniqueEntityId('question-01') }),
			)
		}
		const result = await sut.execute({
			questionId: 'question-01',
			page: 2,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.answers).toHaveLength(2)
	})
})
