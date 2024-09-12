import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
	override: Partial<AnswerProps> = {},
	id?: UniqueEntityId,
) {
	const answer = Answer.create(
		{
			content: faker.lorem.text(),
			authorId: new UniqueEntityId('author-01'),
			questionId: new UniqueEntityId('question-01'),
			...override,
		},
		id,
	)

	return answer
}
