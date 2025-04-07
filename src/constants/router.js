import { formatDate } from "@utils/dateUtil";

const routes = {
    home: '/',
    dashboard: '/',
    newHabit: '/habits/add',
    habitDetails: (id) => `/habits/${id}`,
    editHabit: (id) => `/habits/${id}/edit`,
    editMoodByDate: (date) => `/mood/${formatDate(date, 'date')}`,
    statistics: '/stats',
    settings: '/settings',
};

export default routes;
