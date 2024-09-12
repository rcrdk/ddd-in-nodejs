import { QuestionsRepository } from '@/domain/forum/application/repositories/question-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = []

	async findBySlug(slug: string) {
		const question = this.items.find((question) => question.slug.value === slug)

		return question ?? null
	}

	async create(question: Question) {
		this.items.push(question)
	}
}
