import dayjs from 'dayjs'

import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { Slug } from './value-objects/slug'

export interface QuestionProps {
	authorId: UniqueEntityId
	bestAnswerId?: UniqueEntityId
	title: string
	slug: Slug
	content: string
	createdAt: Date
	updatedAt?: Date
}

export class Question extends Entity<QuestionProps> {
	get authorId() {
		return this.props.authorId
	}

	get bestAnswerId() {
		return this.props.bestAnswerId
	}

	get title() {
		return this.props.title
	}

	get slug() {
		return this.props.slug
	}

	get content() {
		return this.props.content
	}

	get createdAt() {
		return this.props.createdAt
	}

	get updatedAt() {
		return this.props.updatedAt
	}

	get IsNew(): boolean {
		return dayjs().diff(this.createdAt, 'days') <= 3
	}

	get excerpt() {
		return this.content.substring(0, 120).trimEnd().concat('...')
	}

	private touch() {
		this.props.updatedAt = new Date()
	}

	set title(title: string) {
		this.props.title = title
		this.props.slug = Slug.createFromText(title)
		this.touch()
	}

	set content(content: string) {
		this.props.content = content
		this.touch()
	}

	set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
		this.props.bestAnswerId = bestAnswerId
		this.touch()
	}

	static create(
		props: Optional<QuestionProps, 'createdAt' | 'slug'>,
		id?: UniqueEntityId,
	) {
		const question = new Question(
			{
				...props,
				slug: props.slug ?? Slug.createFromText(props.title),
				createdAt: props.createdAt ?? new Date(),
			},
			id,
		)

		return question
	}
}
