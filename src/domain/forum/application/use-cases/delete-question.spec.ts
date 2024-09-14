import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteQuestionUseCase } from './delete-question'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('delete question by id', () => {
	beforeEach(() => {
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository()
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
		)
		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to delete a question', async () => {
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
			questionId: 'question-01',
			authorId: 'author-01',
		})

		expect(inMemoryQuestionsRepository.items).toHaveLength(0)
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-02'),
			},
			new UniqueEntityId('question-02'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		const result = await sut.execute({
			questionId: 'question-02',
			authorId: 'author-01',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
