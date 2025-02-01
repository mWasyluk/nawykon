export const exampleHabits = [
    {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        details: {
            type: "fitness",
            name: "Morning Run",
            description: "Run every morning for 30 minutes",
            startDate: "2024-01-01T00:00:00Z"
        },
        status: "active",
        streak: 10,
        goal: {
            timesPerDay: 1,
            daysOfWeek: [1, 2, 3, 4, 5],
            endDate: undefined
        },
        reminders: ["07:00"]
    },
    {
        id: "9b2e5b1e-3c4b-4d5a-9e6e-1f2a3b4c5d6f",
        details: {
            type: "diet",
            name: "Drink Water",
            description: "Drink 8 glasses of water",
            startDate: "2024-01-01T00:00:00Z"
        },
        status: "completed",
        streak: 30,
        goal: {
            timesPerDay: 4,
            daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
            endDate: undefined
        },
        reminders: ["08:00", "12:00", "15:00", "18:00"]
    },
    {
        id: "d9b1d7a1-2b3c-4d5e-6f7a-8b9c0d1e2f3a",
        details: {
            type: "learning",
            name: "Read a Book",
            description: "Read 20 pages of a book",
            startDate: "2024-01-05T00:00:00Z"
        },
        status: "active",
        streak: 5,
        goal: {
            timesPerDay: 1,
            daysOfWeek: [1, 3, 5],
            endDate: "2024-12-31T00:00:00Z"
        },
        reminders: ["20:00"]
    },
    {
        id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
        details: {
            type: "mindfulness",
            name: "Meditation",
            description: "Practice meditation for 15 minutes",
            startDate: "2024-01-10T00:00:00Z"
        },
        status: "active",
        streak: 2,
        goal: {
            timesPerDay: 1,
            daysOfWeek: [6, 7],
            endDate: undefined
        },
        reminders: ["06:30"]
    }
];
