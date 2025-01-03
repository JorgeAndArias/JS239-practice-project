export class APIManager {
  constructor () {};

  async getContacts() {
    try {
      let response = await fetch('/api/contacts');

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error){
      console.error(`Error while getting all the contacts. ${error}`);
    }
  }

  async getContact(id) {
    try {
      let response = await fetch(`/api/contacts/${id}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error){
      console.error(`Error while getting the contact with ID: ${id}. ${error}`);
    }
  }

  async deleteContact(id) {
    try {
      let response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return true;
    } catch (error){
      console.error(`Error while deleting the contact with ID: ${id}. ${error}`);
    }
  }

  async createContact(data) {
    try {
      let response = await fetch(`/api/contacts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error){
      console.error(`Error while creating the contact with data: ${data}. ${error}`);
    }
  }

  async editContact(id, data) {
    try {
      let response = await fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error){
      console.error(`Error while editing the contact with ID: ${id} and new data: ${data}. ${error}`);
    }
  }
}