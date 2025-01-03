import { APIManager } from "./APIManager.js";
import { UserInterface } from "./userInterface.js";
import { FormValidator } from "./formValidator.js";

class Application {
  constructor () {
    this.api = new APIManager();
    this.UI = new UserInterface();
    this.tags = new Set();
  }

  async initialise () {
    this.contacts = await this.api.getContacts();
    this.UI.displayContacts(this.contacts);
    this.bindEvents();
    this.#initialiseTags();
  }

  bindEvents() {
    this.UI.bindAddContact(() => this.handleAddContact());
    this.UI.bindSubmitForm((contact) => this.handleSubmitForm(contact));
    this.UI.bindContactActions(
      (id) => this.handleEditContact(id),
      (id) => this.handleDeleteContact(id),
      (tag) => this.handleSearchByTag(tag),
    );
    this.UI.bindCancelForm(() => this.handleCancelForm());
    this.UI.bindSearchContacts((query) => this.handleSearchContacts(query));
    this.UI.bindModal(() => this.handleModal());
    this.UI.bindClearSearch(() => this.handleClearSearch());
    this.UI.bindAddTag(() => this.handleAddTag());
    this.UI.bindSubmitTagForm((tagName) => this.handleSubmitTagForm(tagName));
  }

  handleSubmitTagForm(tagName) {
    const formValidator = new FormValidator();
    const validationResult = formValidator.checkTag(tagName);
    const errors = formValidator.checkErrors([validationResult]);

    if (errors.length > 0) {
      this.UI.clearFormErrors(this.UI.tagFormContainer);
      this.UI.displayFormErrors(errors, this.UI.tagFormContainer);
    } else {
      this.tags.add(tagName.toLowerCase());
      this.UI.hideForms();
    }
  }

  handleAddTag() {
    let tagsObject = this.#tagsToObject();
    this.UI.displayAddTagForm(tagsObject);
  }

  async handleClearSearch() {
    this.contacts = await this.api.getContacts();
    this.UI.displayContacts(this.contacts);
  }

  handleSearchByTag(tag) {
    const contacts = this.#findContactsByTag(tag);
    if (contacts) {
      this.UI.displayContacts(contacts);
    }
  }

  handleModal() {
    this.UI.hideForms();
  }

  handleSearchContacts(query) {
    const contacts = this.#findContacts(query);
    if (query && contacts) {
      if (contacts.length > 0) {
        this.UI.displayContacts(contacts);
      } else {
        this.UI.displayNoContactsFoundMessage();
      }
    } else {
      this.UI.displayContacts(this.contacts);
    }
  }

  handleCancelForm() {
    this.UI.hideForms();
  }

  handleEditContact(id) {
    const contact = this.#findContactbyId(id);
    if (contact) {
      this.UI.displayForm(contact, this.#tagsToObject());
    }
  }

  async handleDeleteContact(id) {
    await this.api.deleteContact(id);
    this.contacts = await this.api.getContacts();
    this.UI.displayContacts(this.contacts);
  }

  async handleSubmitForm(contact) {
    const formValidator = new FormValidator();
    const dataValidatorResult = formValidator.validateData(contact);
    const errors = formValidator.checkErrors(dataValidatorResult);

    if (errors.length > 0) {
      this.UI.clearFormErrors(this.UI.contactFormContainer);
      this.UI.displayFormErrors(errors, this.UI.contactFormContainer);
    } else {
      if (contact.id) {
        await this.api.editContact(contact.id, contact);
      } else {
        await this.api.createContact(contact);
      }

      this.contacts = await this.api.getContacts();
      this.UI.displayContacts(this.contacts);
      this.UI.hideForms();
    }
  }

  handleAddContact() {
    this.UI.displayForm(null, this.#tagsToObject());
  }

  #tagsToObject() {
    return [...this.tags].sort().map(tag => {
      return {
        name: tag,
      }
    });
  }

  #findContacts(query) {
    return this.contacts.filter(contact => {
      const values = [contact.full_name, contact.email, contact.phone_number, contact.tags].map(value => value ? value.toLowerCase() : '');
      if (values.some(value => value.includes(query))) {
        return contact;
      }
    });
  }

  #findContactbyId(id) {
    return this.contacts.find(contact => contact.id === parseInt(id, 10));
  }

  #findContactsByTag(tag) {
    return this.contacts.filter(contact => {
      let values = [contact.tags].map(value => value ? value.toLowerCase() : '');
      values = values[0].split(',');

      if (values.some(value => value === tag)) {
        return contact;
      }
    });
  }

  #initialiseTags() {
    this.contacts.forEach(contact => {
      let tags = contact.tags;
      if (tags) {
        tags.split(',').forEach(tag => {
          this.tags.add(tag);
        });
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', e => {
  const app = new Application();
  app.initialise();
})