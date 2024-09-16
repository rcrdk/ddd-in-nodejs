import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeleteAnswerCommentUseCase } from './delete-answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('delete answer comment', () => {
	beforeEach(() => {
		// eslint-disable-next-line prettier/prettier
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
	})

	it('should be able to delete a answer comment', async () => {
		const answerComment = makeAnswerComment()

		await inMemoryAnswerCommentsRepository.create(answerComment)

		await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: answerComment.authorId.toString(),
		})

		expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete another user answer comment', async () => {
		const answerComment = makeAnswerComment({
			authorId: new UniqueEntityId('author-01'),
		})

		await inMemoryAnswerCommentsRepository.create(answerComment)

		const result = await sut.execute({
			answerCommentId: answerComment.id.toString(),
			authorId: 'author-02',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
