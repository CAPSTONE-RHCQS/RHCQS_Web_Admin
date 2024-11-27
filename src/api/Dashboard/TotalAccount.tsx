import requestWebRHCQS from '../../utils/axios';

export async function getTotalSaleStaffAccount() {
  try {
    const response = await requestWebRHCQS.get(
      '/account/total-s-staff-account',
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total account:', error);
    throw new Error('Failed to fetch total account');
  }
}

export async function getTotalDesignerStaffAccount() {
  try {
    const response = await requestWebRHCQS.get(
      '/account/total-d-staff-account',
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total account:', error);
    throw new Error('Failed to fetch total account');
  }
}

export async function getTotalCustomerAccount() {
  try {
    const response = await requestWebRHCQS.get(
      '/account/total-customer-account',
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total account:', error);
    throw new Error('Failed to fetch total account');
  }
}
