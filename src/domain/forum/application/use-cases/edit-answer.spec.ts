import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { EditQuestionUseCase } from './edit-question'
import { UnauthorizedError } from './errors/unauthorized-error'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('edit question by id', () => {
	beforeEach(() => {
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
		sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
	})

	it('should be able to edit a question', async () => {
		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId('author-01'),
			},
			new UniqueEntityId('question-01'),
		)

		await inMemoryQuestionsRepository.create(newQuestion)

		await sut.execute({
			questionId: newQuestion.id.toValue(),
			authorId: 'author-01',
			title: 'Updated title',
			content: 'Update content',
		})

		expect(inMemoryQuestionsRepository.items.at(0)).toMatchObject({
			title: 'Updated title',
			content: 'Update content',
		})
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
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
