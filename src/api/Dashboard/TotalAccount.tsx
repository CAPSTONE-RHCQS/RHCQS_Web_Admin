import requestWebRHCQS from '../../utils/axios';

export async function getTotalSaleStaffAccount() {
  try {
    const response = await requestWebRHCQS.get(
      '/dashboardtotal-s-staff-account',
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total sale staff account:', error);
    throw new Error('Failed to fetch total sale staff account');
  }
}

export async function getTotalDesignerStaffAccount() {
  try {
    const response = await requestWebRHCQS.get(
      '/dashboard/total-d-staff-account',
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total designer staff account:', error);
    throw new Error('Failed to fetch total designer staff account');
  }
}

export async function getTotalCustomerAccount() {
  try {
    const response = await requestWebRHCQS.get(
      '/dashboard/total-customer-account',
      {
        headers: {
          accept: 'text/plain',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching total customer account:', error);
    throw new Error('Failed to fetch total customer account');
  }
}

export async function getTotalProject() {
  try {
    const response = await requestWebRHCQS.get('/dashboard/total-project', {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total project:', error);
    throw new Error('Failed to fetch total project');
  }
}

export async function getTotalProjects() {
  try {
    const response = await requestWebRHCQS.get('/dashboard/total-project', {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching total projects:', error);
    throw new Error('Failed to fetch total projects');
  }
}

export async function getTotalRevenue() {
  try {
    const response = await requestWebRHCQS.get('/dashboard/totalprice', {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data.totalPrice;
  } catch (error) {
    console.error('Error fetching total revenue:', error);
    throw new Error('Failed to fetch total revenue');
  }
}

export async function getTotalProgress() {
  try {
    const response = await requestWebRHCQS.get('/dashboard/totalprogressprice', {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data.totalPrice;
  } catch (error) {
    console.error('Error fetching total progress:', error);
    throw new Error('Failed to fetch total progress');
  }
}

export async function getTotalCost() {
  try {
    const response = await requestWebRHCQS.get('/dashboard/totalpaidprice', {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data.totalPrice;
  } catch (error) {
    console.error('Error fetching total cost:', error);
    throw new Error('Failed to fetch total cost');
  }
}
