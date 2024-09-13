import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('fetch question comments', () => {
	beforeEach(() => {
		inMemoryQuestionCommentsRepository =
			new InMemoryQuestionCommentsRepository()
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to fetch question comments', async () => {
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
		)
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
		)
		await inMemoryQuestionCommentsRepository.create(
			makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
		)

		const result = await sut.execute({
			questionId: 'question-01',
			page: 1,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.questionComments).toHaveLength(3)
	})

	it('should be able to fetch paginated question comments', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryQuestionCommentsRepository.create(
				makeQuestionComment({ questionId: new UniqueEntityId('question-01') }),
			)
		}
		const result = await sut.execute({
			questionId: 'question-01',
			page: 2,
		})

		expect(result.isRight()).toBe(true)
		expect(result.value?.questionComments).toHaveLength(2)
	})
})
