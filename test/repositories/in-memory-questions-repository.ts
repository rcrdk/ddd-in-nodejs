import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = []

	async findById(id: string) {
		const question = this.items.find(
			(question) => question.id.toString() === id,
		)

		return question ?? null
	}

	async findBySlug(slug: string) {
		const question = this.items.find((question) => question.slug.value === slug)

		return question ?? null
	}

	async create(question: Question) {
		this.items.push(question)
	}

	async save(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id)

		this.items[itemIndex] = question

		return this.items[itemIndex]
	}

	async delete(question: Question) {
		const itemIndex = this.items.findIndex((item) => item.id === question.id)

		this.items.splice(itemIndex, 1)
	}
}
