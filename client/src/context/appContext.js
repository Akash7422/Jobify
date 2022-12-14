import React, { useReducer, useContext } from "react"
import axios from "axios"
import reducer from "./reducer"
import {
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    SETUP_USER_BEGIN,
    SETUP_USER_SUCCESS,
    SETUP_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER,
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    HANDLE_CHANGE,
    CLEAR_VALUES,
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
    CLEAR_FILTERS,
    CHANGE_PAGE,
    SET_PAGE_ONE,
} from "./actions"
const token = localStorage.getItem("token")
const user = localStorage.getItem("user")
const userLocation = localStorage.getItem("location")

const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: "",
    alertType: "",
    user: user ? JSON.parse(user) : null,
    token: token ? token : null,
    userLocation: userLocation || "",
    jobLocation: userLocation || "",
    showSidebar: false,
    isEditing: false,
    editJobId: "",
    position: "",
    company: "",
    jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
    jobType: "full-time",
    statusOptions: ["pending", "interview", "declined"],
    status: "pending",
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,
    stats: {},
    monthlyApplications: [],
    search: "",
    searchStatus: "all",
    searchType: "all",
    sort: "latest",
    sortOptions: ["latest", "oldest", "a-z", "z-a"],
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const authFetch = axios.create({
        baseURL: "/api/v1",
        headers: {
            Authorization: `Bearer ${state.token}`,
        },
    })
    // response interceptor
    // authFetch.interceptors.request.use(
    //     (config) => {
    //         config.headers.common["Authorization"] = `Bearer ${state.token}`
    //         return config
    //     },
    //     (error) => {
    //         return Promise.reject(error)
    //     }
    // )
    // // response interceptor
    // authFetch.interceptors.response.use(
    //     (response) => {
    //         return response
    //     },
    //     (error) => {
    //         console.log(error.response)
    //         if (error.response.status === 401) {
    //             console.log("AUTH ERROR")
    //         }
    //         return Promise.reject(error)
    //     }
    // )

    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
    }

    const hideDisplayAlert = () => {
        dispatch({ type: CLEAR_ALERT })
    }

    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("token", token)
        localStorage.setItem("location", location)
    }
    const removeUserToLocalStorage = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        localStorage.removeItem("location")
    }

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN })
        try {
            const { data } = await axios.post(
                "/api/v1/auth/register",
                currentUser
            )
            // console.log(res)
            const { user, token, location } = data
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: { user, location, token },
            })
            addUserToLocalStorage({ user, token, location })
        } catch (err) {
            // console.log(err)
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: { msg: err.response.data.message },
            })
        }
        // console.log(currentUser)
    }

    const loginUser = async (currentUser) => {
        console.log(currentUser)
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            const { data } = await axios.post("/api/v1/auth/login", currentUser)
            // console.log(res)
            const { user, token, location } = data
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: { user, location, token },
            })
            await addUserToLocalStorage({ user, token, location })
        } catch (err) {
            // console.log(err)
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: { msg: err.response.data.message },
            })
        }
    }
    const setupUser = async ({ currentUser, endPoint, alertText }) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {
            const { data } = await axios.post(
                `/api/v1/auth/${endPoint}`,
                currentUser
            )
            //console.log(res)
            const { user, token, location } = data

            dispatch({
                type: SETUP_USER_SUCCESS,
                payload: { user, location, token, alertText },
            })
            await addUserToLocalStorage({ user, token, location })
        } catch (err) {
            // console.log(err)
            dispatch({
                type: SETUP_USER_ERROR,
                payload: { msg: err.response.data.message },
            })
        }
    }
    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserToLocalStorage()
    }
    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const { data } = await authFetch.patch(
                "/auth/updateUser",
                currentUser
            )

            // no token
            const { user, location, token } = data

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: { user, location, token },
            })

            await addUserToLocalStorage({
                user,
                location,
                token: initialState.token,
            })
            setTimeout(() => {
                hideDisplayAlert()
            }, 3000)
        } catch (error) {
            dispatch({
                type: UPDATE_USER_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
    }

    const handleChange = ({ name, value }) => {
        dispatch({ type: HANDLE_CHANGE, payload: { name, value } })
    }
    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }

    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status } = state

            await authFetch.post("/jobs", {
                company,
                position,
                jobLocation,
                jobType,
                status,
            })
            dispatch({
                type: CREATE_JOB_SUCCESS,
            })
            // call function instead clearValues()
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
    }
    const getJobs = async () => {
        dispatch({ type: GET_JOBS_BEGIN })
        const { page, search, searchStatus, searchType, sort } = state

        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        if (search) {
            url = url + `&search=${search}`
        }

        try {
            const { data } = await authFetch(url)
            const { jobs, totalJobs, numOfPages } = data
            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages,
                },
            })
        } catch (error) {
            logoutUser()
        }
    }

    const setEditJob = (id) => {
        // console.log(`set edit job: ${id}`)
        dispatch({ type: SET_EDIT_JOB, payload: { id } })
    }
    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status } = state

            await authFetch.patch(`/jobs/${state.editJobId}`, {
                company,
                position,
                jobLocation,
                jobType,
                status,
            })
            dispatch({
                type: EDIT_JOB_SUCCESS,
            })
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if (error.response.status === 401) return
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
    }
    const setDeleteJob = async (jobId) => {
        dispatch({ type: DELETE_JOB_BEGIN })
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs()
        } catch (error) {
            console.log(error)
            logoutUser()
        }
    }

    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const { data } = await authFetch("/jobs/stats")
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications,
                },
            })
        } catch (err) {
            logoutUser()
        }
    }

    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS })
    }

    const changePage = (page) => {
        dispatch({ type: CHANGE_PAGE, payload: { page } })
    }
    const setPageOne = () => {
        dispatch({ type: SET_PAGE_ONE })
    }
    return (
        <AppContext.Provider
            value={{
                ...state,
                displayAlert,
                hideDisplayAlert,
                registerUser,
                loginUser,
                setupUser,
                toggleSidebar,
                logoutUser,
                updateUser,
                handleChange,
                clearValues,
                editJob,
                createJob,
                getJobs,
                setEditJob,
                setDeleteJob,
                showStats,
                clearFilters,
                changePage,
                setPageOne,
            }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }
