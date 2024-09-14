import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { AnswerQuestionUseCase } from './answer-question'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('answer question', () => {
	beforeEach(() => {
		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository()
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
		)
		sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
	})

	it('should be able to create an question', async () => {
		const result = await sut.execute({
			content: 'Que dia é hoje?',
			authorId: 'instructor-01',
			questionId: 'question-01',
			attachmentsIds: ['1', '2'],
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryAnswersRepository.items.at(0)).toEqual(result.value?.answer)

		expect(
			inMemoryAnswersRepository.items.at(0)?.attachments.currentItems,
		).toHaveLength(2)
		expect(
			inMemoryAnswersRepository.items.at(0)?.attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
			expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
		])
	})
})
