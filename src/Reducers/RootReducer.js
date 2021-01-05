const initState = {
    userData: {}
}

const RootReducer = (state=initState, action) => {
    if(action.type === "SIGNIN") {
        return {
            userData : action.payload
        }
    }
    return state;
}

export default RootReducer;