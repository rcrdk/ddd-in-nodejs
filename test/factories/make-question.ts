import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
	Question,
	QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

export function makeQuestion(override: Partial<QuestionProps> = {}) {
	const question = Question.create({
		authorId: new UniqueEntityId('author-01'),
		title: faker.lorem.sentence(),
		content: faker.lorem.text(),
		...override,
	})

	return question
}
