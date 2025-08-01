import { Navigate } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';


export const CreateAccount = async (username, email, password) => {
    try {
        const data = { username, email, password };
        const response = await axios.post('/api/v1/user/create-new-account/login', data);

        if (response.status === 201) {
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            return {
                user: response.data.user,
                status: response.status,
                statusText: response.statusText,
            };
        }

    } catch (error) {
        return {
            user: null,
            status: error?.response?.status || 500,
            statusText: error.response?.data?.message || "Something went wrong",
        };
    }
};
export const LoginTOAccount = async (email, password) => {
    try {
        const data = { email, password };
        const response = await axios.post('/api/v1/user/account/login', data);

        if (response.status === 200) {
            localStorage.setItem('userData', JSON.stringify(response.data.user));
            return {
                user: response.data.user,
                status: response.status,
                statusText: response.statusText,
            };
        }

    } catch (error) {
        return {
            user: null,
            status: error?.response?.status || 500,
            statusText: error.response?.data?.message || "Something went wrong",
        };
    }
};
export const logout = () => {
    localStorage.removeItem('userData');
    window.location.href = '/';

};

export const FetchModels = async () => {
    try {
        try {
            let link = `/api/v1/models`;
            const { data } = await axios.get(link);
            return data;
        } catch (error) {
            console.log(error);
            return {};
        }
    } catch (error) {

    }
}
export const FetchModel = async (id) => {
    try {
        const response = await axios.get(`/api/v1/models/${id}`);
        if (response.status === 200) {
            return {
                model: response.data.model,
                status: response.status,
                statusText: response.statusText,
            };
        }
    } catch (error) {
        return {
            user: null,
            status: error?.response?.status || 500,
            statusText: error.response?.data?.message || "Something went wrong",
        };
    }
}
export const getInfiniteModelResults = async (pageParam, keyword) => {
    pageParam = pageParam || 1;
    try {
        let link = `/api/v1/models?page=${pageParam}`;
        if (keyword !== "") {
            link += `&keyword=${keyword}`
        }
        const { data } = await axios.get(link);
        return data;
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const newConversation = async (receiver) => {
    try {
        const storedUser = localStorage.getItem('userData');
        if (!storedUser) {
            throw new Error("User not logged in");
        }
        const user = JSON.parse(storedUser);
        const conversationUuid = uuidv4();
        const chatMembers = [
            {
                userId: user._id,
                name: user.username,
                profile: user.profileimage || "",
            },
            {
                userId: receiver.userId,
                name: receiver.name,
                profile: receiver.profile || "",
            },
        ];
        const data = {
            conversationUuid,
            chatMembers,
            senderId: user._id
        };
        const response = await axios.post('/api/v1/converstions/create-newConversation', data);
        return {
            conversation: response.data,
            status: response.status,
            statusText: response.statusText,
        };

    } catch (error) {
        return {
            conversation: null,
            status: error?.response?.status || 500,
            statusText: error?.response?.data?.message || "Failed to create conversation",
        };
    }
};
export const FetchConversations = async () => {
    try {
        const storedUser = localStorage.getItem('userData');
        if (!storedUser) {
            throw new Error("User not logged in");
        }
        const user = JSON.parse(storedUser);
        let link = `/api/v1/converstions/${user._id}`;
        const { data } = await axios.get(link);
        return data;
    } catch (error) {
        console.log(error);
        return {};
    }

}

