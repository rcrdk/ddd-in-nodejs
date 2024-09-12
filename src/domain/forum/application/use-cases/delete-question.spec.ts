import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('delete question by id', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
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

		await sut.execute({
			questionId: 'question-01',
			authorId: 'author-01',
		})

		expect(inMemoryQuestionsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a question from another user', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-02'),
			},
			new UniqueEntityId('question-02'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		await expect(() => {
			return sut.execute({
				questionId: 'question-02',
				authorId: 'author-01',
			})
		}).rejects.toBeInstanceOf(Error)
	})
})
