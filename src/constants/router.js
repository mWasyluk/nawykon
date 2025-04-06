const routes = {
    home: '/',
    dashboard: '/',
    newHabit: '/habits/add',
    habitDetails: (id) => `/habits/${id}`,
    editHabit: (id) => `/habits/${id}/edit`,
    newMood: '/mood/add',
    statistics: '/stats',
    settings: '/settings',
};

export default routes;
