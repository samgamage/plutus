import DispatchKeys from "../../const/Dispatch_Keys";

export const getUser = (uid) => {
    return{
        type: DispatchKeys.USER.GET_USER,
        payload: uid
    }
}

export const setUser = (userData) => {
    return {
        type: DispatchKeys.USER.setUser,
        payload: userData
    }
}
