import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('edit answer by id', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		sut = new EditAnswerUseCase(
			inMemoryAnswersRepository,
			inMemoryAnswerAttachmentsRepository,
		)
	})

	it('should be able to edit a answer', async () => {
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
			answerId: newAnswer.id.toValue(),
			authorId: 'author-01',
			content: 'Update content',
			attachmentsIds: ['1', '3'],
		})

		expect(inMemoryAnswersRepository.items.at(0)).toMatchObject({
			content: 'Update content',
		})

		expect(
			inMemoryAnswersRepository.items.at(0)?.attachments.currentItems,
		).toHaveLength(2)
		expect(
			inMemoryAnswersRepository.items.at(0)?.attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		])
	})

	it('should not be able to edit a answer from another user', async () => {
		const newAnswer = makeAnswer(
			{
				authorId: new UniqueEntityId('author-02'),
			},
			new UniqueEntityId('answer-02'),
		)

		await inMemoryAnswersRepository.create(newAnswer)

		const result = await sut.execute({
			answerId: newAnswer.id.toValue(),
			authorId: 'author-01',
			content: 'Update content',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
