import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/unauthorized-error'

import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('read notification', () => {
	beforeEach(() => {
		inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
		sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
	})

	it('should be able to read a notification', async () => {
		const notification = makeNotification()

		await inMemoryNotificationsRepository.create(notification)

		const result = await sut.execute({
			notificationId: notification.id.toString(),
			recipientId: notification.recipientId.toString(),
		})

		expect(result.isRight()).toBe(true)
		expect(inMemoryNotificationsRepository.items.at(0)?.readAt).toEqual(
			expect.any(Date),
		)
	})

	it('should not be able to read a notification from another user', async () => {
		const newNotification = makeNotification(
			{
				recipientId: new UniqueEntityId('recipient-01'),
			},
			new UniqueEntityId('notification-01'),
		)

		await inMemoryNotificationsRepository.create(newNotification)

		const result = await sut.execute({
			notificationId: 'notification-01',
			recipientId: 'recipient-02',
		})

		expect(result.isLeft()).toBe(true)
		expect(result.value).toBeInstanceOf(UnauthorizedError)
	})
})
