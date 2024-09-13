import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

// eslint-disable-next-line prettier/prettier
export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository
{
	public items: QuestionComment[] = []

	async create(questionComment: QuestionComment) {
		this.items.push(questionComment)
	}
}
