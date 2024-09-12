import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
	authorId: string
	questionId: string
	content: string
}

interface AnswerQuestionUseCaseResponse {
	answer: Answer
}

export class AnswerQuestionUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		authorId,
		questionId,
		content,
	}: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
		const answer = Answer.create({
			content,
			authorId: new UniqueEntityId(authorId),
			questionId: new UniqueEntityId(questionId),
		})

		await this.answersRepository.create(answer)

		return { answer }
	}
}
