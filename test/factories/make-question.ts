import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	Question,
	QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export function makeQuestion(override: Partial<QuestionProps> = {}) {
	const question = Question.create({
		title: 'Example question',
		slug: Slug.create('example-question-01'),
		authorId: new UniqueEntityId('author-01'),
		content: 'Lorem ipsum dolor sit',
		...override,
	})

	return question
}
