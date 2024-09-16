import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('delete question comment', () => {
	beforeEach(() => {
		// eslint-disable-next-line prettier/prettier
		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
		sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
	})

	it('should be able to delete a question comment', async () => {
		const questionComment = makeQuestionComment()

		await inMemoryQuestionCommentsRepository.create(questionComment)

		await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: questionComment.authorId.toString(),
		})

		expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete another user question comment', async () => {
		const questionComment = makeQuestionComment({
			authorId: new UniqueEntityId('author-01'),
		})

		await inMemoryQuestionCommentsRepository.create(questionComment)

		const result = await sut.execute({
			questionCommentId: questionComment.id.toString(),
			authorId: 'author-02',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
