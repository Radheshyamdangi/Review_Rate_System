const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const buildQueryString = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

const parseResponse = async (response) => {
  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const validationMessage = Array.isArray(data.errors)
      ? data.errors.map((error) => error.msg).join(', ')
      : '';
    const message = validationMessage || data.message || data.error || 'Request failed';
    throw new Error(message);
  }

  return data;
};

const request = async (path, options = {}) => {
  const { method = 'GET', body, token, headers = {} } = options;
  const isFormData = body instanceof FormData;

  const requestHeaders = {
    ...headers,
  };

  if (body !== undefined && !isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  return parseResponse(response);
};

export const authApi = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),
};

export const companiesApi = {
  list: (params) => request(`/companies${buildQueryString(params)}`),
  getById: (id) => request(`/companies/${id}`),
  create: (payload, token) => request('/companies', { method: 'POST', body: payload, token }),
  update: (id, payload, token) => request(`/companies/${id}`, { method: 'PUT', body: payload, token }),
  remove: (id, token) => request(`/companies/${id}`, { method: 'DELETE', token }),
};

export const reviewsApi = {
  listByCompany: (companyId, sort) => request(`/reviews/company/${companyId}${buildQueryString({ sort })}`),
  create: (payload, token) => request('/reviews', { method: 'POST', body: payload, token }),
  like: (id, token) => request(`/reviews/${id}/like`, { method: 'PUT', token }),
  remove: (id, token) => request(`/reviews/${id}`, { method: 'DELETE', token }),
};
