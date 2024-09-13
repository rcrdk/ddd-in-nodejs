import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('fetch answer comments', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to fetch answer comments', async () => {
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
		)
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
		)
		await inMemoryAnswerCommentsRepository.create(
			makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
		)

		const { answerComments } = await sut.execute({
			answerId: 'answer-01',
			page: 1,
		})

		expect(answerComments).toHaveLength(3)
	})

	it('should be able to fetch paginated answer comments', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({ answerId: new UniqueEntityId('answer-01') }),
			)
		}
		const { answerComments } = await sut.execute({
			answerId: 'answer-01',
			page: 2,
		})
		expect(answerComments).toHaveLength(2)
	})
})
