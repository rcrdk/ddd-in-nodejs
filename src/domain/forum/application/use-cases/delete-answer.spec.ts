import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteAnswerUseCase } from './delete-answer'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('delete answer by id', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
	})

	it('should be able to delete a answer', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-01'),
			},
			new UniqueEntityId('answer-01'),
		)

		await inMemoryAnswersRepository.create(newAnswer)

		inMemoryAnswerAttachmentsRepository.items.push(
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeAnswerAttachment({
				answerId: newAnswer.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		)

		await sut.execute({
			answerId: 'answer-01',
			authorId: 'author-01',
		})

		expect(inMemoryAnswersRepository.items).toHaveLength(0)
		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-02'),
			},
			new UniqueEntityId('answer-02'),
		)

		await inMemoryAnswersRepository.create(newAnswer)

		const result = await sut.execute({
			answerId: 'answer-02',
			authorId: 'author-01',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
