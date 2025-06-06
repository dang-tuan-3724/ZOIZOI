import axios from 'axios';
import axiosClient from "./apiManager";

const device = {
    addLight: async (token: string, deviceName: string) => {
        try {
            const response = await axiosClient.post('light', {
                deviceName: deviceName,
                status: "able",
                state: "off"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error;
            } else {
            console.error("Unexpected error: ", error);
        }}
    },
    addPump: async (token: string, deviceName: string) => {
        try {
            const response = await axiosClient.post('pump', {
                deviceName: deviceName,
                status: "able",
                autoLevel: true,
                schedule: "06:00, 18:00",
                state: "auto"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error;
            } else {
            console.error("Unexpected error: ", error);
        }}
    },
    addSensor: async (token: string, sensorName: string, type: string, alertThreshold: number) => {
        try {
            const response = await axiosClient.post('sensor', {
                sensorName: sensorName,
                type: type,
                alertThreshold: alertThreshold,
                status: "able"
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error;
            } else {
            console.error("Unexpected error: ", error);
        }}
    },
}

export default device;