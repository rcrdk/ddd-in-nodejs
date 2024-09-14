import { Either, left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UnauthorizedError } from './errors/unauthorized-error'

interface EditAnswerUseCaseRequest {
	authorId: string
	answerId: string
	content: string
	attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
	ResourceNotFoundError | UnauthorizedError,
	{
		answer: Answer
	}
>

export class EditAnswerUseCase {
	constructor(
		private answersRepository: AnswersRepository,
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async execute({
		authorId,
		answerId,
		content,
		attachmentsIds,
	}: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
		const answer = await this.answersRepository.findById(answerId)

		if (!answer) {
			return left(new ResourceNotFoundError())
		}

		if (authorId !== answer.authorId.toString()) {
			return left(new UnauthorizedError())
		}

		const currentAnswerAttachments =
			await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

		const answerAttachmentList = new AnswerAttachmentList(
			currentAnswerAttachments,
		)

		const answerAttachments = attachmentsIds.map((attachmentId) => {
			return AnswerAttachment.create({
				attachmentId: new UniqueEntityId(attachmentId),
				answerId: answer.id,
			})
		})

		answerAttachmentList.update(answerAttachments)

		answer.content = content
		answer.attachments = answerAttachmentList

		await this.answersRepository.save(answer)

		return right({
			answer,
		})
	}
}
