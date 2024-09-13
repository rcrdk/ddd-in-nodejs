import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

// eslint-disable-next-line prettier/prettier
export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository
{
	public items: QuestionComment[] = []

	async findById(id: string) {
		const questionComment = this.items.find(
			(comment) => comment.id.toString() === id,
		)

		return questionComment ?? null
	}

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment)
	}

	async delete(questionComment: QuestionComment) {
		const itemIndex = this.items.findIndex(
			(item) => item.id === questionComment.id,
		)

		this.items.splice(itemIndex, 1)
	}
}
