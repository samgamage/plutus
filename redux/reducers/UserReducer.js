import DispatchKeys from '../../const/Dispatch_Keys';

const defaultState = {
    user:{
        uid: ''
    }
}

export default (state = defaultState, action) => {
    switch(action.type){
        case DispatchKeys.USER.GET_USER:
            console.log("Inside GET_USER Reducer");
            break;
        case DispatchKeys.USER.SET_USER:
            console.log("Inside SET_USER Reducer");

             break;

    }

    return state;
}