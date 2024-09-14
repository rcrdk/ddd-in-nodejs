import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'

// eslint-disable-next-line prettier/prettier
export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository
{
	public items: QuestionAttachment[] = []

	async findManyByQuestionId(id: string) {
		const items = this.items.filter((item) => item.questionId.toString() === id)

		return items
	}

	async deleteManyByQuestionId(id: string) {
		const questionAttachments = this.items.filter(
			(item) => item.questionId.toString() !== id,
		)

		this.items = questionAttachments
	}
}
