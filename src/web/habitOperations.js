import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import db from '../configs/firebaseConfig';

// Save a string to Firestore
export const saveStringToFirestore = async (stringValue) => {
    try {
        const docRef = await addDoc(collection(db, "strings"), {
            string: stringValue,
            // timestamp: new Date().toISOString()
        });
        console.log('String saved with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving string:', error);
        throw error;
    }
};

// Retrieve a string from Firestore by document ID
export const getStringFromFirestore = async (docId) => {
    try {
        const docRef = doc(db, "strings", docId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
            return docSnapshot.data().string;
        } else {
            throw new Error('String not found');
        }
    } catch (error) {
        console.error('Error retrieving string:', error);
        throw error;
    }
};


// // import { getDatabase } from '@database-init';
// import { hashPassword, comparePassword } from '@utils';
// // import { User } from  '../';
// // import { MoodReport } from './MoodReport';
// // import { Habit } from './Habit';
// // import { HabitRecord } from './HabitRecord';
// // import { HabitStatistics } from './HabitStatistics';

// const db = getDatabase();

// // 1. Users
// export const addUser = async (username, email, password, preferences) => {
//     try {
//         const passwordHash = hashPassword(password);
//         const result = await db.execAsync(
//             `INSERT INTO Users (username, email, password_hash, preferences) VALUES (?, ?, ?, ?);`,
//             [username, email, passwordHash, '']
//         );
//         console.log('User added successfully with ID:', result.insertId);
//     } catch (error) {
//         console.error('Error adding user:', error);
//     }
// };

// export const authenticateUser = async (email, password) => {
//     try {
//         const result = await db.execAsync(
//             `SELECT id, username, email, preferences, password_hash FROM Users WHERE email = ?;`,
//             [email]
//         );
//         if (result.rows.length > 0) {
//             const user = result.rows[0];
//             const isMatch = comparePassword(password, user.password_hash);
//             if (isMatch) {
//                 delete user.password_hash; // Omit sensitive data
//                 return new User(user.id, user.username, user.email, null, JSON.parse(user.preferences));
//             }
//         }
//         return null;
//     } catch (error) {
//         console.error('Error authenticating user:', error);
//         return null;
//     }
// };

// export const getUsers = async () => {
//     try {
//         const result = await db.execAsync(`SELECT id, username, email, preferences FROM Users;`);
//         return result.rows.map(row => new User(row.id, row.username, row.email, null, JSON.parse(row.preferences)));
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         return [];
//     }
// };

// export const updateUserPreferences = async (userId, preferences) => {
//     try {
//         await db.execAsync(
//             `UPDATE Users SET preferences = ? WHERE id = ?;`,
//             [JSON.stringify(preferences), userId]
//         );
//         console.log('Preferences updated for user ID:', userId);
//     } catch (error) {
//         console.error('Error updating preferences:', error);
//     }
// };

// // 2. Mood Reports
// export const addMoodReport = async (userId, mood, energy, note, timestamp) => {
//     try {
//         const report = new MoodReport(null, userId, mood, energy, note, timestamp);
//         await db.execAsync(
//             `INSERT INTO MoodReports (userId, mood, energy, note, timestamp) VALUES (?, ?, ?, ?, ?);`,
//             [report.userId, report.mood, report.energy, report.note, report.timestamp]
//         );
//         console.log('Mood report added successfully');
//     } catch (error) {
//         console.error('Error adding mood report:', error);
//     }
// };

// export const getMoodReports = async (userId) => {
//     try {
//         const result = await db.execAsync(
//             `SELECT * FROM MoodReports WHERE userId = ?;`,
//             [userId]
//         );
//         return result.rows.map(row => new MoodReport(row.id, row.userId, row.mood, row.energy, row.note, row.timestamp));
//     } catch (error) {
//         console.error('Error fetching mood reports:', error);
//         return [];
//     }
// };

// // 3. Habits
// export const addHabit = async (userId, details, status, goal, reminders) => {
//     try {
//         const habit = new Habit(null, userId, details, status, 0, goal, reminders);
//         await db.execAsync(
//             `INSERT INTO Habits (userId, details, status, goal, reminders) VALUES (?, ?, ?, ?, ?);`,
//             [habit.userId, JSON.stringify(habit.details), habit.status, JSON.stringify(habit.goal), JSON.stringify(habit.reminders)]
//         );
//         console.log('Habit added successfully');
//     } catch (error) {
//         console.error('Error adding habit:', error);
//     }
// };

// export const getHabits = async (userId) => {
//     try {
//         const result = await db.execAsync(
//             `SELECT * FROM Habits WHERE userId = ?;`,
//             [userId]
//         );
//         return result.rows.map(row => new Habit(row.id, row.userId, JSON.parse(row.details), row.status, row.streak, JSON.parse(row.goal), JSON.parse(row.reminders)));
//     } catch (error) {
//         console.error('Error fetching habits:', error);
//         return [];
//     }
// };

// export const updateHabitStatus = async (habitId, status) => {
//     try {
//         await db.execAsync(
//             `UPDATE Habits SET status = ? WHERE id = ?;`,
//             [status, habitId]
//         );
//         console.log('Status updated for Habit ID:', habitId);
//     } catch (error) {
//         console.error('Error updating status:', error);
//     }
// };

// // 4. Habit Records
// export const addHabitRecord = async (habitId, timestamp, status) => {
//     try {
//         const record = new HabitRecord(null, habitId, timestamp, status);
//         await db.execAsync(
//             `INSERT INTO HabitRecords (habitId, timestamp, status) VALUES (?, ?, ?);`,
//             [record.habitId, record.timestamp, record.status]
//         );
//         console.log('Habit record added successfully');
//     } catch (error) {
//         console.error('Error adding habit record:', error);
//     }
// };

// export const getHabitRecords = async (habitId) => {
//     try {
//         const result = await db.execAsync(
//             `SELECT * FROM HabitRecords WHERE habitId = ?;`,
//             [habitId]
//         );
//         return result.rows.map(row => new HabitRecord(row.id, row.habitId, row.timestamp, row.status));
//     } catch (error) {
//         console.error('Error fetching habit records:', error);
//         return [];
//     }
// };

// // 5. Habit Statistics
// export const getHabitStatistics = async (habitId) => {
//     try {
//         const result = await db.execAsync(
//             `
//             SELECT
//             (SELECT COUNT(*) FROM HabitRecords WHERE habitId = ? AND status = 'completed') AS completedCount,
//             (SELECT COUNT(*) FROM HabitRecords WHERE habitId = ? AND status = 'skipped') AS skippedCount,
//             MAX(streak) AS longestStreak,
//             (SELECT AVG(mood) FROM MoodReports WHERE userId = (SELECT userId FROM Habits WHERE id = ?)) AS avgMood
//             FROM HabitRecords
//             WHERE habitId = ?;
//             `,
//             [habitId, habitId, habitId, habitId]
//         );
//         const stats = result.rows[0];
//         return new HabitStatistics(null, habitId, stats.completedCount, stats.skippedCount, stats.longestStreak, stats.avgMood);
//     } catch (error) {
//         console.error('Error fetching statistics:', error);
//         return null;
//     }
// };

// import pool from '@database-init';

// Funkcja tworzenia nowego wpisu
// export const createRecord = async (table, data) => {
//   try {
//     const columns = Object.keys(data).join(', ');
//     const values = Object.values(data);
//     const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

//     const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
//     const result = await pool.query(query, values);
//     return result.rows[0];
//   } catch (error) {
//     console.error('Błąd przy tworzeniu rekordu:', error);
//     throw error;
//   }
// };

// // Funkcja odczytu danych
// const readRecords = async (table, conditions = {}) => {
//   try {
//     const conditionKeys = Object.keys(conditions);
//     const conditionPlaceholders = conditionKeys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
//     const values = Object.values(conditions);

//     const query = conditionKeys.length
//       ? `SELECT * FROM ${table} WHERE ${conditionPlaceholders}`
//       : `SELECT * FROM ${table}`;
//     const result = await pool.query(query, values);
//     return result.rows;
//   } catch (error) {
//     console.error('Błąd przy odczycie rekordów:', error);
//     throw error;
//   }
// };

// // Funkcja aktualizacji danych
// const updateRecord = async (table, id, data) => {
//   try {
//     const keys = Object.keys(data);
//     const values = Object.values(data);
//     const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

//     const query = `UPDATE ${table} SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`;
//     const result = await pool.query(query, [...values, id]);
//     return result.rows[0];
//   } catch (error) {
//     console.error('Błąd przy aktualizacji rekordu:', error);
//     throw error;
//   }
// };

// // Funkcja usuwania danych
// const deleteRecord = async (table, id) => {
//   try {
//     const query = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
//     const result = await pool.query(query, [id]);
//     return result.rows[0];
//   } catch (error) {
//     console.error('Błąd przy usuwaniu rekordu:', error);
//     throw error;
//   }
// };

// export {
//   createRecord,
//   readRecords,
//   updateRecord,
//   deleteRecord,
// };
