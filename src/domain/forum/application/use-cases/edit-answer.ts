import { AnswersRepository } from '../repositories/answers-repository'

interface EditAnswerUseCaseRequest {
	authorId: string
	answerId: string
	content: string
}

interface EditAnswerUseCaseResponse {}

export class EditAnswerUseCase {
	constructor(private answersRepository: AnswersRepository) {}

	async execute({
		authorId,
		answerId,
		content,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if (!answer) {
			throw new Error('Answer not found.')
		}

		if (authorId !== answer.authorId.toString()) {
			throw new Error('Unauthorized.')
		}

		answer.content = content

		await this.answersRepository.save(answer)

		return {}
	}
}
