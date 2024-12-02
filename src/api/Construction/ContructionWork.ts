import requestWebRHCQS from "../../utils/axios";

export const getConstructionWorks = async (page: number, size: number) => {
    try {
        const response = await requestWebRHCQS.get(`/construction-work`, {
            params: { page, size },
            headers: {
                accept: 'text/plain',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching constructions:', error);
        throw error;
    }
};

export const getConstructionWorkById = async (id: string) => {
    try {
        const response = await requestWebRHCQS.get(`/construction-work/id?workId=${id}`, {
            headers: {
                accept: 'text/plain',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching constructions:', error);
        throw error;
    }
};

export const getPackageConstructionWork = async (id: string) => {
    try {
        const response = await requestWebRHCQS.get(`/construction-work/workid?workId=${id}`, {
            headers: {
                accept: 'text/plain',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching constructions:', error);
        throw error;
    }
};
