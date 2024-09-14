import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditQuestionUseCase } from './edit-question'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('edit question by id', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		)
	})

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-01'),
			},
			new UniqueEntityId('question-01'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('1'),
			}),
			makeQuestionAttachment({
				questionId: newQuestion.id,
				attachmentId: new UniqueEntityId('2'),
			}),
		)

		await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-01',
			title: 'Updated title',
			content: 'Update content',
			attachmentsIds: ['1', '3'],
		})

		expect(inMemoryQuestionsRepository.items.at(0)).toMatchObject({
			title: 'Updated title',
			content: 'Update content',
		})

		expect(
			inMemoryQuestionsRepository.items.at(0)?.attachments.currentItems,
		).toHaveLength(2)
		expect(
			inMemoryQuestionsRepository.items.at(0)?.attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
		])
	})

	it('should not be able to edit a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-02'),
			},
			new UniqueEntityId('question-02'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-01',
			title: 'Updated title',
			content: 'Update content',
			attachmentsIds: [],
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
