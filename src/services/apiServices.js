
import axiosServices from '../api/axiosServices'

// ================= BOOK APIs =================

// VIEW ALL BOOKS API
export const viewBooksAPI = async () => {
    return await axiosServices('GET', '/books', {})
}

// ADD BOOK API
export const addBookAPI = async (reqBody) => {
    return await axiosServices('POST', '/books', reqBody)
}

// EDIT BOOK API
export const editBookAPI = async (id, reqBody) => {
    return await axiosServices('PUT', `/books/${id}`, reqBody)
}

// DELETE BOOK API
export const deleteBookAPI = async (id) => {
    return await axiosServices('DELETE', `/books/${id}`, {})
}


// ================= REVIEW APIs =================

// VIEW ALL REVIEWS API
export const viewReviewsAPI = async () => {
    return await axiosServices('GET', '/reviews', {})
}

// ADD REVIEW API
export const addReviewAPI = async (reqBody) => {
    return await axiosServices('POST', '/reviews', reqBody)
}

// EDIT REVIEW API
export const editReviewAPI = async (id, reqBody) => {
    return await axiosServices('PUT', `/reviews/${id}`, reqBody)
}

// DELETE REVIEW API
export const deleteReviewAPI = async (id) => {
    return await axiosServices('DELETE', `/reviews/${id}`, {})
}

// VIEW ALL READING ACTIVITIES API
export const viewActivitiesAPI = async () => {
    return await axiosServices('GET', '/activities', {})
}

// ADD READING ACTIVITY API
export const addActivityAPI = async (reqBody) => {
    return await axiosServices('POST', '/activities', reqBody)
}

// DELETE READING ACTIVITY API
export const deleteActivityAPI = async (id) => {
    return await axiosServices('DELETE', `/activities/${id}`, {})
}

// VIEW READING GOALS API
export const viewGoalsAPI = async () => {
    return await axiosServices('GET', '/goals', {})
}

// ADD READING GOAL API
export const addGoalAPI = async (reqBody) => {
    return await axiosServices('POST', '/goals', reqBody)
}

// EDIT READING GOAL API
export const editGoalAPI = async (id, reqBody) => {
    return await axiosServices('PUT', `/goals/${id}`, reqBody)
}

// DELETE READING GOAL API
export const deleteGoalAPI = async (id) => {
    return await axiosServices('DELETE', `/goals/${id}`, {})
}

// REPORT DOWNLOAD APIs

export const addReportDownloadAPI = async (reqBody) => {
    return await axiosServices('POST', '/downloads', reqBody)
}

export const viewReportDownloadsAPI = async () => {
    return await axiosServices('GET', '/downloads', {})
}

export const deleteReportDownloadAPI = async (id) => {
    return await axiosServices('DELETE', `/downloads/${id}`, {})
}