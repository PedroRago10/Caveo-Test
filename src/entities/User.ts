import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

/**
 * Entity: User
 * 
 * @description Represents a user in the system with key information such as name, email, role, and onboarding status.
 *              This entity interacts with both the application database and AWS Cognito for user data management.
 */
@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // Unique identifier for each user, generated as a UUID.

    @Column()
    name: string = ''; // Stores user's name.

    @Column({ unique: true })
    email: string = ''; // User's unique email address.

    @Column()
    role: string = ''; // Defines the user's role, e.g., 'admin', 'user'.

    @Column({ default: false })
    isOnboarded: boolean = false; // Indicates whether the user has completed onboarding.

    @CreateDateColumn()
    createdAt: Date = new Date(); // Timestamp for when the user record was created.

    @UpdateDateColumn()
    updatedAt: Date = new Date(); // Timestamp for when the user record was last updated.

    @DeleteDateColumn()
    deletedAt?: Date; // Timestamp for soft deletion; remains null if the user is active.
}