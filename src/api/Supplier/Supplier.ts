import requestWebRHCQS from '../../utils/axios';
import { SupplierItem, SupplierListResponse, UpdateSupplierRequest } from '../../types/Supplier';

export async function getSupplierList(
    page: number,
    size: number,
): Promise<SupplierListResponse> {
    try {
        const response = await requestWebRHCQS.get('/supplier', {
            params: { page, size },
            headers: {
                accept: 'text/plain',
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier list:', error);
        throw new Error('Failed to fetch supplier list');
    }
}

export async function createSupplier(data: UpdateSupplierRequest) {
    try {
        const response = await requestWebRHCQS.post('/supplier', data, {
            headers: {
                accept: 'text/plain',
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating supplier:', error);
        throw new Error('Failed to create supplier');
    }
}

export async function updateSupplier(id: string, data: UpdateSupplierRequest) {
    try {
        const response = await requestWebRHCQS.put(`/supplier?id=${id}`, data,
            {
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'multipart/form-data',
                },
            },
        );
        return response.data;
    } catch (error) {
        console.error('Error updating supplier:', error);
        throw new Error('Failed to update supplier');
    }
}

