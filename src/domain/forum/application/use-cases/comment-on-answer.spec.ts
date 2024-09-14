import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { CommentOnAnswerUseCase } from './comment-on-answer'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: CommentOnAnswerUseCase

describe('comment on answer', () => {
	beforeEach(() => {
		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)

		sut = new CommentOnAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerCommentsRepository,
		)
	})

	it('should be able to comment on answer', async () => {
		const answer = makeAnswer()

		await inMemoryAnswersRepository.create(answer)

		const result = await sut.execute({
			answerId: answer.id.toString(),
			authorId: answer.authorId.toString(),
			content: 'Comentário teste',
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswerCommentsRepository.items.at(0)?.content).toEqual(
			'Comentário teste',
		)
	})
})
